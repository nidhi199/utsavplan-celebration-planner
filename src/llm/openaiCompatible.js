/**
 * OpenAI-compatible chat completions client shared by Groq and OpenRouter.
 */

const ENDPOINTS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
};

/**
 * Calls an OpenAI-compatible endpoint.
 * @param {'groq' | 'openrouter'} provider
 * @param {string} prompt
 * @param {object} options
 */
export async function callOpenAICompatible(provider, prompt, { apiKey, model, timeoutMs = 8000 } = {}) {
  if (!apiKey) {
    throw new Error(`MISSING_KEY: ${provider} API key not configured.`);
  }

  const endpoint = ENDPOINTS[provider];
  if (!endpoint) {
    throw new Error(`UNKNOWN_PROVIDER: Provider ${provider} is not supported.`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const systemMessage = 'You are an Indian celebration & event planner. Return ONLY a valid JSON array of up to 5 concise, actionable strings. No markdown backticks, no explanations. Each string under 100 characters.';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(provider === 'openrouter' ? { 'HTTP-Referer': 'https://utsavplan.local', 'X-Title': 'UtsavPlan' } : {}),
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const err = new Error(`${provider} API error: HTTP ${response.status}`);
      err.status = response.status;
      err.retryAfter = response.headers.get('retry-after');
      throw err;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      const err = new Error(`UNUSABLE_OUTPUT: Empty response from ${provider}`);
      err.status = 502;
      throw err;
    }

    let parsed;
    try {
      // Remove any surrounding code blocks if present
      const cleanContent = content.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      const match = content.match(/\[\s*".*"\s*\]/s);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        // Line-by-line fallback
        parsed = content
          .split('\n')
          .map(line => line.trim().replace(/^[-*•\d.\s]+/, ''))
          .filter(line => line.length > 5);
      }
    }

    let list = Array.isArray(parsed) ? parsed : (parsed.ideas || parsed.items || []);
    if (!Array.isArray(list) || list.length === 0) {
      const err = new Error(`UNUSABLE_OUTPUT: Output from ${provider} is not a valid list`);
      err.status = 502;
      throw err;
    }

    return list
      .map(item => (typeof item === 'string' ? item : item.idea || item.title || JSON.stringify(item)))
      .map(s => s.trim().replace(/^[-*•\d.\s]+/, ''))
      .filter(Boolean)
      .slice(0, 5)
      .map(s => (s.length > 120 ? s.slice(0, 117) + '...' : s));
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`TIMEOUT: ${provider} call exceeded ${timeoutMs}ms`);
      timeoutErr.status = 408;
      throw timeoutErr;
    }
    throw err;
  }
}
