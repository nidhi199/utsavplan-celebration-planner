import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePlanInput, sanitizeNotes } from '../src/validator.js';

test('Validation: Accepts valid celebration payload', () => {
  const payload = {
    eventType: 'wedding',
    date: '2027-12-15',
    guestCount: 250,
    budget: 750000,
    style: 'royal',
    setting: 'hybrid',
    dietary: ['jain', 'vegetarian'],
    children: true,
    notes: 'Need grand flower mandap and Haldi decor',
  };

  const res = validatePlanInput(payload);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.errors.length, 0);
  assert.strictEqual(res.data.eventType, 'wedding');
  assert.strictEqual(res.data.budget, 750000);
});

test('Validation: Rejects invalid event type, negative budget, past date', () => {
  const invalidPayload = {
    eventType: 'corporate_seminar', // not allowed
    date: '2000-01-01', // in the past
    guestCount: 0, // must be >= 1
    budget: -500, // must be >= 1000
    style: 'alien_cyberpunk', // not allowed
    setting: 'outer_space', // not allowed
  };

  const res = validatePlanInput(invalidPayload);
  assert.strictEqual(res.valid, false);
  assert.ok(res.errors.length >= 4);
});

test('Sanitization: Strips malicious HTML/scripts and trims long notes', () => {
  const maliciousInput = '<script>alert("hack")</script>Hello <b onclick="evil()">world</b>! ' + 'A'.repeat(1500);
  const cleaned = sanitizeNotes(maliciousInput);

  assert.ok(!cleaned.includes('<script>'), 'Script tags must be removed');
  assert.ok(!cleaned.includes('</script>'), 'Script end tags must be removed');
  assert.ok(!cleaned.includes('<b'), 'HTML elements must be stripped');
  assert.ok(cleaned.length <= 1000, 'Cleaned output must be at most 1000 characters');
  assert.match(cleaned, /^alert\("hack"\)Hello world! A+/);
});

test('Privacy: Strips vendor details and payment info from plan payload', () => {
  const payloadWithVendors = {
    eventType: 'birthday',
    date: '2027-08-10',
    guestCount: 60,
    budget: 150000,
    style: 'modern',
    setting: 'indoor',
    dietary: ['vegetarian'],
    children: true,
    notes: 'Party with magician',
    // Sensitive client-only vendor details that must NEVER be retained on server or sent to LLM
    vendorName: 'Royal Caterers Jaipur',
    vendorPhone: '+91 98765 43210',
    advancePaid: 25000,
    balanceDue: 35000,
    bankAccount: '1234567890',
  };

  const res = validatePlanInput(payloadWithVendors);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.data.vendorName, undefined);
  assert.strictEqual(res.data.vendorPhone, undefined);
  assert.strictEqual(res.data.advancePaid, undefined);
  assert.strictEqual(res.data.balanceDue, undefined);
  assert.strictEqual(res.data.bankAccount, undefined);
  assert.deepStrictEqual(Object.keys(res.data).sort(), [
    'budget',
    'children',
    'date',
    'dietary',
    'eventType',
    'guestCount',
    'notes',
    'setting',
    'style',
    'theme',
  ].sort());
});

test('Theme validation: Validates allowed themes and falls back to royal-rajwada', () => {
  const validThemes = ['royal-rajwada', 'udaipur-palace', 'peacock-regalia', 'boho-sundowner'];

  for (const theme of validThemes) {
    const res = validatePlanInput({
      eventType: 'wedding',
      date: '2027-11-11',
      guestCount: 100,
      budget: 300000,
      theme,
    });
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.data.theme, theme);
  }

  // Invalid theme falls back to royal-rajwada
  const fallbackRes = validatePlanInput({
    eventType: 'wedding',
    date: '2027-11-11',
    guestCount: 100,
    budget: 300000,
    theme: 'non_existent_neon_cyberpunk',
  });
  assert.strictEqual(fallbackRes.valid, true);
  assert.strictEqual(fallbackRes.data.theme, 'royal-rajwada');
});

test('Voice input sanitization: Treats voice transcripts with identical safety rules', () => {
  const voiceTranscriptWithHtml = 'Music DJ with <img src=x onerror=alert(1)> and 100 Jain meals';
  const sanitizedVoice = sanitizeNotes(voiceTranscriptWithHtml);

  assert.ok(!sanitizedVoice.includes('<img'));
  assert.ok(!sanitizedVoice.includes('onerror'));
  assert.ok(sanitizedVoice.includes('Music DJ with'));
  assert.ok(sanitizedVoice.includes('100 Jain meals'));
});
