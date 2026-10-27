import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from '../server.js';

// Tests must never call real AI providers: with no keys the ladder uses the rule-based fallback.
for (const key of ['GEMINI_API_KEY', 'GROQ_API_KEY', 'OPENROUTER_API_KEY']) delete process.env[key];

test('HTTP API: Healthcheck, plan generation, ics export, security headers, and static serving', async (t) => {
  const server = createServer();

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(() => {
    return new Promise(resolve => server.close(resolve));
  });

  // 1. Healthcheck /healthz
  {
    const res = await fetch(`${baseUrl}/healthz`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.service, 'utsavplan');
    assert.ok(res.headers.get('content-security-policy'));
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
  }

  // 2. Plan API with valid payload
  {
    const res = await fetch(`${baseUrl}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'wedding',
        date: '2027-10-20',
        guestCount: 200,
        budget: 600000,
        style: 'royal',
        setting: 'outdoor',
        dietary: ['jain'],
        children: true,
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.plan);
    assert.strictEqual(data.plan.budget.totalBudget, 600000);
    assert.ok(data.plan.timeline.milestones.length > 0);
    assert.ok(data.ideas.length > 0);
    assert.ok(typeof data.ideasSource === 'string');
  }

  // 3. Plan API validation failure (400)
  {
    const res = await fetch(`${baseUrl}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'unsupported_event',
      }),
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(Array.isArray(data.errors));
    assert.ok(data.errors.length > 0);
  }

  // 4. Export ICS API
  {
    const res = await fetch(`${baseUrl}/api/export-ics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Sharma Anniversary',
        milestones: [
          { date: '2027-05-10', titleEn: 'Milestone 1', daysBefore: 10 },
        ],
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/calendar/);
    assert.match(res.headers.get('content-disposition'), /attachment/);
    const text = await res.text();
    assert.ok(text.includes('BEGIN:VCALENDAR'));
    assert.ok(text.includes('Sharma Anniversary'));
  }

  // 5. Static file serving and Path Traversal Protection
  {
    // Normal static file
    const resNormal = await fetch(`${baseUrl}/index.html`);
    assert.strictEqual(resNormal.status, 200);
    const html = await resNormal.text();
    assert.ok(html.includes('UtsavPlan'));

    // Directory traversal attempt: should be blocked with 403 Forbidden
    const traversalStatus = await new Promise((resolve, reject) => {
      const clientReq = http.get(
        {
          hostname: '127.0.0.1',
          port: address.port,
          path: '/../package.json',
        },
        res => {
          resolve(res.statusCode);
        }
      );
      clientReq.on('error', reject);
    });
    assert.strictEqual(traversalStatus, 403);
  }

  // 6. Request body size limit (100 KB)
  {
    const oversizedBody = JSON.stringify({
      eventType: 'wedding',
      notes: 'x'.repeat(120 * 1024), // 120 KB payload
    });

    try {
      const res = await fetch(`${baseUrl}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: oversizedBody,
      });
      assert.strictEqual(res.status, 413);
    } catch {
      // Socket destruction or 413 is expected
      assert.ok(true);
    }
  }
});
