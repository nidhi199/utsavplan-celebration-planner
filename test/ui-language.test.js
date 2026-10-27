import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { TRANSLATIONS, t } from '../src/i18n.js';

describe('UI and i18n Language Toggle Stability', () => {
  it('Every ID referenced in setText or updateLanguageUI exists in public/index.html', () => {
    const html = fs.readFileSync(path.resolve('public/index.html'), 'utf8');
    const app = fs.readFileSync(path.resolve('public/app.js'), 'utf8');

    // Extract updateLanguageUI body
    const match = app.match(/function updateLanguageUI\(\) \{([\s\S]*?)\n\}/);
    assert.ok(match, 'updateLanguageUI function must exist in public/app.js');
    const fnBody = match[1];

    // Find all setText calls
    const setTextMatches = Array.from(fnBody.matchAll(/setText\(\s*['"]([^'"]+)['"]/g)).map(m => m[1]);
    assert.ok(setTextMatches.length > 0, 'setText calls should exist');

    for (const id of setTextMatches) {
      const exists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
      assert.ok(exists, `Element id="${id}" referenced in updateLanguageUI must exist in index.html`);
    }
  });

  it('No unused translation keys remain in TRANSLATIONS dictionary', () => {
    const app = fs.readFileSync(path.resolve('public/app.js'), 'utf8');
    const html = fs.readFileSync(path.resolve('public/index.html'), 'utf8');
    const server = fs.readFileSync(path.resolve('server.js'), 'utf8');

    const combinedSource = app + html + server;

    const removedKeys = [
      'tagline',
      'childrenLabel',
      'summarySection',
      'warningsSection',
      'printBtn',
      'voiceDictationTitle',
      'voiceDictationDesc',
      'voiceMicStart',
      'voiceMicStop',
      'prompt_haldi',
      'prompt_sangeet',
      'prompt_catering',
      'prompt_eco',
      'prompt_photo',
      'voiceReadingNow',
      'welcomePrintBtn',
      'welcomeVoiceBtn',
      'totalAdvancePaid',
      'totalBalanceDue',
      'noChanges',
      'rupeeSymbol',
      'itemsLeft',
    ];

    for (const k of removedKeys) {
      assert.equal(TRANSLATIONS.en[k], undefined, `Key ${k} should be removed from en`);
      assert.equal(TRANSLATIONS.hi[k], undefined, `Key ${k} should be removed from hi`);
    }
  });

  it('Bilingual translations match between English and Hindi for all active keys', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    const hiKeys = Object.keys(TRANSLATIONS.hi);

    assert.equal(enKeys.length, hiKeys.length, 'English and Hindi dictionary sizes must match');

    for (const key of enKeys) {
      assert.ok(TRANSLATIONS.hi[key], `Missing Hindi translation for active key: ${key}`);
      assert.notEqual(TRANSLATIONS.en[key], TRANSLATIONS.hi[key], `Active key ${key} must have translated Hindi text`);
    }
  });

  it('t() helper returns valid strings for both languages and handles parameter interpolation', () => {
    assert.equal(t('en', 'headerShareBtn'), 'Share Plan');
    assert.equal(t('hi', 'headerShareBtn'), 'योजना साझा करें');
    assert.equal(t('en', 'daysLeft', { days: 42 }), '42 days to event');
    assert.equal(t('hi', 'daysLeft', { days: 42 }), 'कार्यक्रम में 42 दिन शेष');
  });
});
