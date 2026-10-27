import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  serializePlanForUrl,
  deserializePlanFromUrl,
  buildPlanJsonExport,
  validateAndParsePlanJson,
} from '../src/share.js';
import { TRANSLATIONS } from '../src/i18n.js';

describe('Share Plan Feature', () => {
  it('Roundtrip serialization: Encodes and decodes celebration parameters correctly', () => {
    const input = {
      eventType: 'wedding',
      date: '2026-11-20',
      guestCount: 450,
      budget: 1500000,
      style: 'royal',
      theme: 'royal-rajwada',
      setting: 'hybrid',
      dietary: ['jain', 'vegetarian'],
      children: true,
      notes: 'Haldi floral shower with marigold flower decor, Shehnai at entrance.',
    };
    const checked = ['task_venue_01', 'task_caterer_02'];

    const encoded = serializePlanForUrl(input, checked);
    assert.ok(typeof encoded === 'string' && encoded.length > 0);

    const decoded = deserializePlanFromUrl(encoded);
    assert.ok(decoded);
    assert.equal(decoded.eventType, 'wedding');
    assert.equal(decoded.date, '2026-11-20');
    assert.equal(decoded.guestCount, 450);
    assert.equal(decoded.budget, 1500000);
    assert.equal(decoded.style, 'royal');
    assert.equal(decoded.theme, 'royal-rajwada');
    assert.equal(decoded.setting, 'hybrid');
    assert.deepEqual(decoded.dietary, ['jain', 'vegetarian']);
    assert.equal(decoded.children, true);
    assert.ok(decoded.notes.includes('Haldi floral shower'));
    assert.deepEqual(decoded.checkedTasks, ['task_venue_01', 'task_caterer_02']);
  });

  it('Handles full URL hash string with #plan= prefix gracefully', () => {
    const input = {
      eventType: 'birthday',
      date: '2026-12-05',
      guestCount: 60,
      budget: 80000,
      style: 'modern',
      theme: 'peacock-regalia',
      setting: 'indoor',
      dietary: ['vegetarian'],
      children: true,
      notes: 'Magic show and superhero theme cupcakes',
    };

    const encoded = serializePlanForUrl(input);
    const fullHash = `#plan=${encoded}&ref=family`;
    const decoded = deserializePlanFromUrl(fullHash);

    assert.ok(decoded);
    assert.equal(decoded.eventType, 'birthday');
    assert.equal(decoded.guestCount, 60);
    assert.equal(decoded.budget, 80000);
  });

  it('Gracefully handles corrupt or malformed encoded strings without throwing', () => {
    assert.equal(deserializePlanFromUrl(''), null);
    assert.equal(deserializePlanFromUrl(null), null);
    assert.equal(deserializePlanFromUrl(undefined), null);
    assert.equal(deserializePlanFromUrl('invalid-base-64!!!***'), null);
    assert.equal(deserializePlanFromUrl('#plan=not-valid-json-123'), null);
  });

  it('Privacy: Export payload excludes sensitive vendor names and advance payments', () => {
    const formValues = {
      eventType: 'community',
      date: '2026-10-30',
      guestCount: 500,
      budget: 300000,
      style: 'festive',
      theme: 'udaipur-palace',
      setting: 'outdoor',
      dietary: ['satvik'],
      children: false,
      notes: 'Navratri Dandiya night with live Dhol',
    };

    const planSummary = {
      timeline: { leadTimeDays: 45 },
      budget: { total: 300000, perGuest: 600 },
      ideas: ['Community Rangoli competition', 'Live folk orchestra'],
      ceremonyPathway: [{ title: 'Dandiya Raas' }],
    };

    const checkedTasks = ['c60_permits'];

    const exported = buildPlanJsonExport(formValues, planSummary, checkedTasks);

    assert.equal(exported.app, 'UtsavPlan');
    assert.equal(exported.schemaVersion, '1.0');
    assert.ok(exported.exportedAt);
    assert.equal(exported.event.eventType, 'community');
    assert.equal(exported.event.guestCount, 500);
    assert.deepEqual(exported.checkedTasks, ['c60_permits']);

    // Ensure no private vendor phones, account numbers, or advances exist in export
    const jsonStr = JSON.stringify(exported);
    assert.equal(jsonStr.includes('vendorDetails'), false);
    assert.equal(jsonStr.includes('actualSpends'), false);
    assert.equal(jsonStr.includes('phone'), false);
    assert.equal(jsonStr.includes('advancePaid'), false);
  });

  it('JSON Import validation: Accepts valid JSON export and rejects malformed files', () => {
    const validJson = JSON.stringify({
      app: 'UtsavPlan',
      event: {
        eventType: 'wedding',
        date: '2026-11-25',
        guestCount: 300,
        budget: 900000,
        style: 'traditional',
        theme: 'royal-rajwada',
        setting: 'hybrid',
        dietary: ['vegetarian'],
        children: false,
        notes: 'Sangeet stage setup',
      },
      checkedTasks: ['task_01'],
    });

    const result = validateAndParsePlanJson(validJson);
    assert.equal(result.valid, true);
    assert.equal(result.event.eventType, 'wedding');
    assert.equal(result.event.budget, 900000);
    assert.deepEqual(result.checkedTasks, ['task_01']);

    // Invalid event type
    const invalidType = validateAndParsePlanJson(JSON.stringify({ event: { eventType: 'alien-gathering', budget: 100, guestCount: 10 } }));
    assert.equal(invalidType.valid, false);

    // Negative budget
    const negativeBudget = validateAndParsePlanJson(JSON.stringify({ event: { eventType: 'wedding', budget: -500, guestCount: 10 } }));
    assert.equal(negativeBudget.valid, false);

    // Invalid JSON string
    const malformed = validateAndParsePlanJson('{ bad json');
    assert.equal(malformed.valid, false);
  });

  it('i18n: All share plan dictionary keys exist for both English and Hindi', () => {
    const requiredKeys = [
      'headerShareBtn',
      'shareModalTitle',
      'shareModalDesc',
      'lblShareLink',
      'shareLinkHelp',
      'copyShareLinkBtn',
      'linkCopied',
      'lblExportJson',
      'descExportJson',
      'downloadJsonBtn',
      'lblImportJson',
      'descImportJson',
      'uploadJsonBtn',
      'planLoadedSuccess',
      'invalidJsonFile',
      'sharePrivacyNote',
      'closeModal',
    ];

    for (const key of requiredKeys) {
      assert.ok(TRANSLATIONS.en[key], `Missing English key: ${key}`);
      assert.ok(TRANSLATIONS.hi[key], `Missing Hindi key: ${key}`);
      assert.notEqual(TRANSLATIONS.en[key], TRANSLATIONS.hi[key], `Hindi key must be translated: ${key}`);
    }
  });
});
