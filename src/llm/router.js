/**
 * LLM Fallback Ladder Router.
 * Manages order of providers, circuit breaking, timeouts, sanitization, and fallback to rules.
 */

import { callGemini } from './gemini.js';
import { callOpenAICompatible } from './openaiCompatible.js';
import { generateRuleBasedIdeas } from './rules.js';

// In-memory circuit breaker cooldown map: provider -> unix epoch ms when cooldown expires
const cooldownMap = new Map();

/**
 * Resets circuit breaker cooldowns (useful for unit testing).
 */
export function _resetCooldowns() {
  cooldownMap.clear();
}

/**
 * Gets the current cooldown expiry map (useful for inspection/testing).
 */
export function _getCooldowns() {
  return new Map(cooldownMap);
}

/**
 * Determines whether an error warrants cooling down the provider and trying the next one.
 */
function isFailoverError(err) {
  const status = Number(err.status) || 0;
  const msg = (err.message || '').toLowerCase();

  // 400 Bad Request indicates malformed request on our end; do not failover blindly
  if (status === 400) {
    return false;
  }

  // Rate-limit / Quota / Billing / Server error / Network / Timeout / Unusable output
  if (
    status === 429 ||
    status === 402 ||
    status === 403 ||
    (status >= 500 && status <= 599) ||
    status === 408 ||
    msg.includes('rate') ||
    msg.includes('quota') ||
    msg.includes('timeout') ||
    msg.includes('abort') ||
    msg.includes('unusable') ||
    msg.includes('fetch failed') ||
    msg.includes('network')
  ) {
    return true;
  }

  return true;
}

/**
 * Constructs prompt with quoted sanitized user context.
 */
function buildPrompt(context) {
  const { eventType, guestCount, budget, style, setting, dietary = [], children, notes, tradition } = context;
  const dietaryStr = dietary.length > 0 ? dietary.join(', ') : 'standard catering';
  const notesQuoted = notes ? `"""${notes}"""` : 'None';
  const traditionLine = tradition ? `- Wedding Tradition (quoted): "${tradition}"\n` : '';

  return `Generate up to 5 creative, highly memorable celebration ideas for an Indian event planner.
Event Details:
- Type: ${eventType}
${traditionLine}- Guests: ${guestCount}
- Budget: INR ${budget}
- Style: ${style}
- Venue Setting: ${setting}
- Dietary Preferences: ${dietaryStr}
- Children Attending: ${children ? 'Yes' : 'No'}
- User Free-text Notes (quoted): ${notesQuoted}

Requirements:
- Return ONLY a JSON array of up to 5 short strings (e.g. ["Idea 1", "Idea 2"]).
- Each string must be an actionable, distinct, culturally appropriate celebration idea.
- Keep each string under 100 characters.`;
}

/**
 * Main function to generate celebration ideas through the LLM ladder.
 * @param {object} context
 * @returns {Promise<{ ideas: string[], ideasSource: string }>}
 */
export async function getCelebrationIdeas(context) {
  const ladderEnv = process.env.LLM_LADDER || 'gemini,groq,openrouter';
  const providers = ladderEnv.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);

  const cooldownSeconds = parseInt(process.env.LLM_COOLDOWN_SECONDS || '60', 10);
  const prompt = buildPrompt(context);

  const totalTimeBudgetMs = 15000;
  const startTime = Date.now();

  for (const provider of providers) {
    // Check total time budget
    const elapsed = Date.now() - startTime;
    if (elapsed >= totalTimeBudgetMs) {
      console.warn('[LLM Router] Total time budget (15s) exhausted. Falling back to rules.');
      break;
    }

    // 1. Check API Key
    let apiKey = '';
    let model = '';
    if (provider === 'gemini') {
      apiKey = process.env.GEMINI_API_KEY || '';
      model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
    } else if (provider === 'groq') {
      apiKey = process.env.GROQ_API_KEY || '';
      model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    } else if (provider === 'openrouter') {
      apiKey = process.env.OPENROUTER_API_KEY || '';
      model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';
    }

    if (!apiKey) {
      // Missing key: skip quietly as specified
      continue;
    }

    // 2. Check Circuit Breaker Cooldown
    const cooldownUntil = cooldownMap.get(provider) || 0;
    if (Date.now() < cooldownUntil) {
      const waitRemaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      console.warn(`[LLM Router] Provider ${provider} is cooling down (${waitRemaining}s remaining). Skipping.`);
      continue;
    }

    // Provider call timeout: 8s or remaining budget, whichever is smaller
    const remainingBudget = totalTimeBudgetMs - (Date.now() - startTime);
    const timeoutMs = Math.min(8000, Math.max(1000, remainingBudget));

    try {
      let ideas = [];
      if (provider === 'gemini') {
        ideas = await callGemini(prompt, { apiKey, model, timeoutMs });
      } else if (provider === 'groq' || provider === 'openrouter') {
        ideas = await callOpenAICompatible(provider, prompt, { apiKey, model, timeoutMs });
      }

      if (Array.isArray(ideas) && ideas.length > 0) {
        return {
          ideas,
          ideasSource: provider,
        };
      } else {
        throw new Error(`UNUSABLE_OUTPUT: No valid ideas returned by ${provider}`);
      }
    } catch (err) {
      // Log sanitized error without leaking API keys or full prompt
      console.warn(`[LLM Router] Provider ${provider} failed: ${err.message || err}`);

      if (err.status === 400) {
        // Bad request from client code: log and stop ladder
        console.error(`[LLM Router] Provider ${provider} returned 400 Bad Request. Aborting ladder.`);
        break;
      }

      if (isFailoverError(err)) {
        // Calculate cooldown
        let cdSec = cooldownSeconds;
        if (err.retryAfter) {
          const parsedRetry = parseInt(err.retryAfter, 10);
          if (!Number.isNaN(parsedRetry) && parsedRetry > 0) {
            cdSec = parsedRetry;
          }
        }
        cooldownMap.set(provider, Date.now() + cdSec * 1000);
        // Continue to next provider in the ladder
      } else {
        break;
      }
    }
  }

  // Fallback to rule-based ideas
  const fallbackIdeas = generateRuleBasedIdeas(context);
  return {
    ideas: fallbackIdeas,
    ideasSource: 'rules',
  };
}
