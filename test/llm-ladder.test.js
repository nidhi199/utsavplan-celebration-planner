import test from 'node:test';
import assert from 'node:assert/strict';
import { getCelebrationIdeas, _resetCooldowns, _getCooldowns } from '../src/llm/router.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

function restoreEnv() {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
  _resetCooldowns();
}

test('LLM Ladder: First provider returns 429 and the second answers', async (t) => {
  t.after(restoreEnv);
  _resetCooldowns();

  process.env.LLM_LADDER = 'gemini,groq,openrouter';
  process.env.GEMINI_API_KEY = 'mock-gemini-key';
  process.env.GROQ_API_KEY = 'mock-groq-key';
  delete process.env.OPENROUTER_API_KEY;

  let callCount = 0;
  globalThis.fetch = async (url) => {
    callCount++;
    if (url.includes('generativelanguage.googleapis.com')) {
      // First provider returns 429 Rate Limit
      return new Response(JSON.stringify({ error: { message: 'Resource exhausted' } }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '30' },
      });
    }

    if (url.includes('api.groq.com')) {
      // Second provider returns valid response
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  'Groq Idea 1: Regal Mandap',
                  'Groq Idea 2: Sangeet flashmob',
                  'Groq Idea 3: Matka chai stall',
                ]),
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Unexpected URL: ' + url);
  };

  const result = await getCelebrationIdeas({
    eventType: 'wedding',
    guestCount: 200,
    budget: 600000,
    style: 'royal',
    setting: 'indoor',
    dietary: ['jain'],
    children: false,
    notes: 'Sangeet focus',
  });

  assert.strictEqual(result.ideasSource, 'groq');
  assert.strictEqual(result.ideas.length, 3);
  assert.match(result.ideas[0], /Groq Idea 1/);
  assert.strictEqual(callCount, 2);
});

test('LLM Ladder: Timeout triggers fallback to next provider or rules', async (t) => {
  t.after(restoreEnv);
  _resetCooldowns();

  process.env.LLM_LADDER = 'gemini,groq';
  process.env.GEMINI_API_KEY = 'mock-gemini-key';
  process.env.GROQ_API_KEY = 'mock-groq-key';

  globalThis.fetch = async (url, opts) => {
    if (url.includes('generativelanguage.googleapis.com')) {
      // Simulate timeout by aborting immediately
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    }

    if (url.includes('api.groq.com')) {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify(['Groq Backup Idea: Polaroid photo guestbook']),
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };

  const result = await getCelebrationIdeas({
    eventType: 'birthday',
    guestCount: 50,
    budget: 50000,
    style: 'modern',
    setting: 'indoor',
  });

  assert.strictEqual(result.ideasSource, 'groq');
  assert.strictEqual(result.ideas[0], 'Groq Backup Idea: Polaroid photo guestbook');
});

test('LLM Ladder: All providers fail so rules are used', async (t) => {
  t.after(restoreEnv);
  _resetCooldowns();

  process.env.LLM_LADDER = 'gemini,groq';
  process.env.GEMINI_API_KEY = 'mock-gemini-key';
  process.env.GROQ_API_KEY = 'mock-groq-key';

  globalThis.fetch = async () => {
    return new Response('Internal Server Error', { status: 500 });
  };

  const result = await getCelebrationIdeas({
    eventType: 'community',
    guestCount: 300,
    budget: 150000,
    style: 'festive',
    setting: 'outdoor',
    dietary: ['satvik'],
  });

  assert.strictEqual(result.ideasSource, 'rules');
  assert.ok(Array.isArray(result.ideas));
  assert.ok(result.ideas.length >= 3);
});

test('LLM Ladder: Missing keys are skipped without calling fetch', async (t) => {
  t.after(restoreEnv);
  _resetCooldowns();

  process.env.LLM_LADDER = 'gemini,groq,openrouter';
  delete process.env.GEMINI_API_KEY; // Missing Gemini key
  delete process.env.GROQ_API_KEY; // Missing Groq key
  process.env.OPENROUTER_API_KEY = 'mock-openrouter-key'; // Only OpenRouter has key

  let fetchCalls = [];
  globalThis.fetch = async (url) => {
    fetchCalls.push(url);
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify(['OpenRouter Idea: Rangoli competition']),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const result = await getCelebrationIdeas({
    eventType: 'community',
    guestCount: 200,
    budget: 100000,
  });

  assert.strictEqual(result.ideasSource, 'openrouter');
  assert.strictEqual(fetchCalls.length, 1);
  assert.ok(fetchCalls[0].includes('openrouter.ai'));
});

test('LLM Ladder: Cooldown skips a failed provider', async (t) => {
  t.after(restoreEnv);
  _resetCooldowns();

  process.env.LLM_LADDER = 'gemini,groq';
  process.env.GEMINI_API_KEY = 'mock-gemini-key';
  process.env.GROQ_API_KEY = 'mock-groq-key';

  let geminiCalls = 0;
  globalThis.fetch = async (url) => {
    if (url.includes('generativelanguage.googleapis.com')) {
      geminiCalls++;
      return new Response(JSON.stringify({ error: 'rate limit' }), { status: 429 });
    }
    return new Response(
      JSON.stringify({
        choices: [{ message: { content: JSON.stringify(['Groq Fast Idea']) } }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  // First request: Gemini fails with 429, enters cooldown
  const first = await getCelebrationIdeas({ eventType: 'wedding', guestCount: 100, budget: 300000 });
  assert.strictEqual(first.ideasSource, 'groq');
  assert.strictEqual(geminiCalls, 1);

  const cooldowns = _getCooldowns();
  assert.ok(cooldowns.has('gemini'), 'Gemini must be marked in cooldown map');
  assert.ok(cooldowns.get('gemini') > Date.now());

  // Second request: Gemini should be skipped completely because of cooldown!
  const second = await getCelebrationIdeas({ eventType: 'wedding', guestCount: 100, budget: 300000 });
  assert.strictEqual(second.ideasSource, 'groq');
  assert.strictEqual(geminiCalls, 1, 'Gemini should not be called again while under cooldown');
});

test('LLM Ladder: Bad AI output moves to the next provider', async (t) => {
  t.after(restoreEnv);
  _resetCooldowns();

  process.env.LLM_LADDER = 'gemini,groq';
  process.env.GEMINI_API_KEY = 'mock-gemini-key';
  process.env.GROQ_API_KEY = 'mock-groq-key';

  globalThis.fetch = async (url) => {
    if (url.includes('generativelanguage.googleapis.com')) {
      // Returns garbage non-JSON content
      return new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: 'Here is some unparseable markdown that is not JSON' }] } }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (url.includes('api.groq.com')) {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify(['Groq Rescued Idea: Live dhol welcome']),
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };

  const result = await getCelebrationIdeas({
    eventType: 'wedding',
    guestCount: 200,
    budget: 500000,
  });

  assert.strictEqual(result.ideasSource, 'groq');
  assert.match(result.ideas[0], /Live dhol/);
});
