import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRADITIONS,
  TRADITION_MAP,
  ALLOWED_TRADITION_IDS,
  getTradition,
  isValidTradition,
  TRADITION_DISCLAIMER,
} from '../src/traditions.js';
import { validatePlanInput } from '../src/validator.js';
import {
  calculateBudget,
  calculateTimeline,
  generateChecklists,
  generateWarnings,
  generateCeremonyPathway,
} from '../src/planner.js';

test('Traditions: Every tradition has all required fields', () => {
  const expectedTraditionIds = [
    'general',
    'hindu-north',
    'hindu-south',
    'bengali',
    'marwari',
    'gujarati',
    'punjabi-sikh',
    'muslim-nikah',
    'christian',
    'jain',
    'parsi',
  ];

  assert.strictEqual(
    ALLOWED_TRADITION_IDS.length,
    11,
    'Should have exactly 11 supported traditions'
  );
  assert.deepStrictEqual(
    [...ALLOWED_TRADITION_IDS].sort(),
    [...expectedTraditionIds].sort(),
    'Allowed tradition IDs must match specified set'
  );

  for (const id of ALLOWED_TRADITION_IDS) {
    const tradition = getTradition(id);
    assert.ok(tradition, `Tradition data must exist for id: ${id}`);
    assert.strictEqual(tradition.id, id, `Tradition id property must match: ${id}`);

    // English & Hindi names
    assert.ok(
      typeof tradition.nameEn === 'string' && tradition.nameEn.trim().length > 0,
      `Tradition ${id} must have non-empty nameEn`
    );
    assert.ok(
      typeof tradition.nameHi === 'string' && tradition.nameHi.trim().length > 0,
      `Tradition ${id} must have non-empty nameHi`
    );

    // Ceremony pathway
    assert.ok(
      Array.isArray(tradition.pathway) && tradition.pathway.length >= 2,
      `Tradition ${id} must have a pathway with at least 2 ceremonies`
    );
    tradition.pathway.forEach((ceremony, idx) => {
      assert.ok(ceremony.nameEn, `Ceremony ${idx} in ${id} must have nameEn`);
      assert.ok(ceremony.nameHi, `Ceremony ${idx} in ${id} must have nameHi`);
      assert.ok(ceremony.descEn, `Ceremony ${idx} in ${id} must have descEn`);
      assert.ok(ceremony.descHi, `Ceremony ${idx} in ${id} must have descHi`);
      assert.ok(ceremony.timingEn, `Ceremony ${idx} in ${id} must have timingEn`);
      assert.ok(ceremony.timingHi, `Ceremony ${idx} in ${id} must have timingHi`);
    });

    // Dress notes
    assert.ok(tradition.dressNotes, `Tradition ${id} must have dressNotes`);
    assert.ok(
      typeof tradition.dressNotes.en === 'string' && tradition.dressNotes.en.trim().length > 0,
      `Tradition ${id} must have dressNotes.en`
    );
    assert.ok(
      typeof tradition.dressNotes.hi === 'string' && tradition.dressNotes.hi.trim().length > 0,
      `Tradition ${id} must have dressNotes.hi`
    );

    // Food and dietary notes
    assert.ok(tradition.foodNotes, `Tradition ${id} must have foodNotes`);
    assert.ok(
      typeof tradition.foodNotes.en === 'string' && tradition.foodNotes.en.trim().length > 0,
      `Tradition ${id} must have foodNotes.en`
    );
    assert.ok(
      typeof tradition.foodNotes.hi === 'string' && tradition.foodNotes.hi.trim().length > 0,
      `Tradition ${id} must have foodNotes.hi`
    );

    // Vendor checklist additions
    assert.ok(
      Array.isArray(tradition.vendorAdditions) && tradition.vendorAdditions.length > 0,
      `Tradition ${id} must have vendorAdditions array`
    );

    // Budget weight adjustments
    assert.ok(tradition.budgetAdjustments, `Tradition ${id} must have budgetAdjustments`);
    const budgetCategories = [
      'venue_decor',
      'catering_food',
      'photography_video',
      'attire_rituals',
      'entertainment_music',
      'logistics_favors',
      'contingency',
    ];
    for (const cat of budgetCategories) {
      assert.strictEqual(
        typeof tradition.budgetAdjustments[cat],
        'number',
        `Tradition ${id} budgetAdjustments must have numeric weight for ${cat}`
      );
    }

    // Timeline tasks to add
    assert.ok(
      Array.isArray(tradition.timelineAdditions) && tradition.timelineAdditions.length > 0,
      `Tradition ${id} must have timelineAdditions array`
    );
  }

  // Helper functions
  assert.strictEqual(isValidTradition('bengali'), true);
  assert.strictEqual(isValidTradition('non_existent'), false);
  assert.strictEqual(getTradition('christian').nameEn, 'Christian');
  assert.strictEqual(getTradition('invalid'), null);
  assert.ok(TRADITION_MAP.jain, 'TRADITION_MAP must contain jain');
  assert.ok(TRADITION_DISCLAIMER.en.includes('Customs vary by family and region'));
});

test('Traditions: Budget weights total 100 for every tradition', () => {
  for (const id of ALLOWED_TRADITION_IDS) {
    const tradition = getTradition(id);
    const sum = Object.values(tradition.budgetAdjustments).reduce(
      (acc, val) => acc + val,
      0
    );
    assert.strictEqual(
      sum,
      100,
      `Budget weights for tradition "${id}" must sum to exactly 100, got ${sum}`
    );
  }
});

test('Traditions: Jain forces no root vegetables in dietary notes', () => {
  const jain = getTradition('jain');
  assert.ok(jain, 'Jain tradition must exist');

  // Verify dietary notes explicitly mandate no root vegetables
  assert.ok(
    jain.foodNotes.en.toLowerCase().includes('no root vegetables'),
    'Jain dietary notes in English must explicitly mention "no root vegetables"'
  );
  assert.ok(
    jain.foodNotes.hi.includes('कंदमूल') || jain.foodNotes.hi.includes('जमीकंद'),
    'Jain dietary notes in Hindi must mention no root vegetables / kandmool'
  );

  // In planner: calculateBudget with tradition: 'jain'
  const budgetResult = calculateBudget({
    budget: 1000000,
    guestCount: 200,
    eventType: 'wedding',
    tradition: 'jain',
    dietary: [],
  });

  const cateringCat = budgetResult.categories.find(c => c.id === 'catering_food');
  assert.ok(cateringCat, 'Catering category must exist');
  const cateringReason = cateringCat.reasonEn || cateringCat.rationale || '';
  assert.ok(
    cateringReason.toLowerCase().includes('jain') ||
      cateringReason.toLowerCase().includes('root') ||
      cateringReason.toLowerCase().includes('sattvic'),
    'Catering reason must reflect Jain dietary rules'
  );

  // In planner: generateWarnings with tradition: 'jain'
  const warnings = generateWarnings({
    eventType: 'wedding',
    tradition: 'jain',
    dietary: [],
  });
  const hasJainDietaryWarning = warnings.some(
    w =>
      (w.textEn && w.textEn.toLowerCase().includes('root vegetable')) ||
      (w.textEn && w.textEn.toLowerCase().includes('sattvic')) ||
      (w.textEn && w.textEn.toLowerCase().includes('jain'))
  );
  assert.strictEqual(
    hasJainDietaryWarning,
    true,
    'Warnings must include Jain dietary requirement (no root vegetables)'
  );
});

test('Traditions: Invalid tradition IDs are rejected', () => {
  // Invalid string tradition ID
  const invalidPayload1 = {
    eventType: 'wedding',
    date: '2027-11-20',
    guestCount: 200,
    budget: 600000,
    tradition: 'cyberpunk_wedding',
  };
  const res1 = validatePlanInput(invalidPayload1);
  assert.strictEqual(res1.valid, false);
  assert.ok(
    res1.errors.some(e => e.includes('Wedding tradition must be one of')),
    'Validation error must reject invalid tradition id'
  );

  // Another unknown tradition
  const invalidPayload2 = {
    eventType: 'wedding',
    date: '2027-11-20',
    guestCount: 200,
    budget: 600000,
    tradition: 'viking',
  };
  const res2 = validatePlanInput(invalidPayload2);
  assert.strictEqual(res2.valid, false);

  // Non-wedding event with tradition selected must also be rejected
  const invalidPayload3 = {
    eventType: 'birthday',
    date: '2027-11-20',
    guestCount: 50,
    budget: 100000,
    tradition: 'punjabi-sikh',
  };
  const res3 = validatePlanInput(invalidPayload3);
  assert.strictEqual(res3.valid, false);
  assert.ok(
    res3.errors.some(e => e.includes('Wedding tradition can only be specified for wedding events')),
    'Non-wedding event cannot specify tradition'
  );

  // Valid tradition ID is accepted
  const validPayload = {
    eventType: 'wedding',
    date: '2027-11-20',
    guestCount: 200,
    budget: 600000,
    tradition: 'marwari',
  };
  const resValid = validatePlanInput(validPayload);
  assert.strictEqual(resValid.valid, true);
  assert.strictEqual(resValid.data.tradition, 'marwari');

  // Null or empty tradition is accepted
  const emptyTraditionPayload = {
    eventType: 'wedding',
    date: '2027-11-20',
    guestCount: 200,
    budget: 600000,
    tradition: null,
  };
  const resEmpty = validatePlanInput(emptyTraditionPayload);
  assert.strictEqual(resEmpty.valid, true);
  assert.strictEqual(resEmpty.data.tradition, undefined);
});

test('Traditions: Planner output changes when a tradition is chosen', () => {
  const baseInput = {
    eventType: 'wedding',
    eventDate: '2027-10-15',
    guestCount: 300,
    budget: 1200000,
    style: 'traditional',
  };

  // 1. Budget breakdown differs based on tradition adjustments
  const defaultBudget = calculateBudget({ ...baseInput, tradition: null });
  const marwariBudget = calculateBudget({ ...baseInput, tradition: 'marwari' });
  const christianBudget = calculateBudget({ ...baseInput, tradition: 'christian' });

  const defaultVenue = defaultBudget.categories.find(b => b.id === 'venue_decor').amount;
  const marwariVenue = marwariBudget.categories.find(b => b.id === 'venue_decor').amount;
  const christianVenue = christianBudget.categories.find(b => b.id === 'venue_decor').amount;

  assert.notStrictEqual(
    defaultVenue,
    marwariVenue,
    'Marwari venue budget should differ from default budget'
  );
  assert.notStrictEqual(
    marwariVenue,
    christianVenue,
    'Marwari venue budget should differ from Christian venue budget'
  );

  // 2. Ceremony pathway differs based on tradition
  const defaultPathway = generateCeremonyPathway('wedding', null);
  const bengaliPathway = generateCeremonyPathway('wedding', 'bengali');
  const punjabiPathway = generateCeremonyPathway('wedding', 'punjabi-sikh');

  assert.notStrictEqual(
    bengaliPathway.map(c => c.nameEn).join(','),
    punjabiPathway.map(c => c.nameEn).join(','),
    'Bengali and Punjabi Sikh ceremony pathways must have distinct ceremony names'
  );
  assert.ok(
    bengaliPathway.some(c => c.nameEn.includes('Saat Paak') || c.nameEn.includes('Shubho Drishti')),
    'Bengali pathway must include traditional ceremonies like Saat Paak / Shubho Drishti'
  );
  assert.ok(
    punjabiPathway.some(c => c.nameEn.includes('Anand Karaj') || c.nameEn.includes('Lavan')),
    'Punjabi Sikh pathway must include Anand Karaj'
  );

  // 3. Vendor checklist additions
  const defaultChecklists = generateChecklists({ eventType: 'wedding', tradition: null });
  const muslimChecklists = generateChecklists({ eventType: 'wedding', tradition: 'muslim-nikah' });

  const defaultItems = defaultChecklists.flatMap(c => c.items);
  const muslimItems = muslimChecklists.flatMap(c => c.items);

  assert.ok(
    muslimItems.length > defaultItems.length,
    'Muslim Nikah checklist should include tradition-specific vendor additions'
  );
  assert.ok(
    muslimItems.some(item => (item.textEn && item.textEn.includes('Qazi')) || (item.textEn && item.textEn.includes('Nikah'))),
    'Muslim checklist must include Qazi / Nikahnama vendor items'
  );

  // 4. Timeline additions
  const defaultTimeline = calculateTimeline({
    eventDate: '2027-10-15',
    eventType: 'wedding',
    tradition: null,
  });
  const southIndianTimeline = calculateTimeline({
    eventDate: '2027-10-15',
    eventType: 'wedding',
    tradition: 'hindu-south',
  });

  const defaultMilestones = defaultTimeline.milestones.map(m => m.titleEn).join(' ');
  const southMilestones = southIndianTimeline.milestones.map(m => m.titleEn).join(' ');

  assert.notStrictEqual(
    defaultMilestones,
    southMilestones,
    'South Indian wedding timeline should include tradition-specific timeline milestones'
  );
  assert.ok(
    southMilestones.includes('Vadhyar') || southMilestones.includes('Muhurtham') || southMilestones.includes('Purohit'),
    'South Indian timeline must include Vadhyar/Purohit consultation'
  );

  // 5. Tradition disclaimer appears in warnings
  const warnings = generateWarnings({
    eventType: 'wedding',
    tradition: 'gujarati',
  });
  const hasDisclaimer = warnings.some(w =>
    w.textEn && w.textEn.includes('Customs vary by family and region')
  );
  assert.strictEqual(
    hasDisclaimer,
    true,
    'Warnings must include the respectful tradition disclaimer note'
  );
});
