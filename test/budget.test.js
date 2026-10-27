import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBudget, calculateSpendTracker, generateCeremonyPathway } from '../src/planner.js';

test('Budget math: Categories must sum EXACTLY to total budget', () => {
  const testBudgets = [1000, 50000, 235451, 999999, 10000000];

  for (const budget of testBudgets) {
    const result = calculateBudget({
      eventType: 'wedding',
      budget,
      guestCount: 200,
      style: 'royal',
      setting: 'outdoor',
      dietary: ['jain', 'satvik'],
      children: true,
    });

    const sum = result.categories.reduce((acc, cat) => acc + cat.amount, 0);
    assert.strictEqual(
      sum,
      budget,
      `Calculated sum ${sum} must match total budget ${budget} with zero rupee variance.`
    );
  }
});

test('Context rules: Jain or Satvik dietary increases catering allocation', () => {
  const standard = calculateBudget({
    eventType: 'wedding',
    budget: 500000,
    guestCount: 150,
    style: 'traditional',
    setting: 'indoor',
    dietary: ['vegetarian'],
  });

  const jain = calculateBudget({
    eventType: 'wedding',
    budget: 500000,
    guestCount: 150,
    style: 'traditional',
    setting: 'indoor',
    dietary: ['jain'],
  });

  const standardCatering = standard.categories.find(c => c.id === 'catering_food');
  const jainCatering = jain.categories.find(c => c.id === 'catering_food');

  assert.ok(
    jainCatering.amount >= standardCatering.amount,
    'Jain catering allocation should be higher than or equal to standard catering.'
  );
  assert.match(jainCatering.reasonEn, /Jain|Satvik/i);
});

test('Context rules: Outdoor setting increases venue/decor allocation for weather protection', () => {
  const indoor = calculateBudget({
    eventType: 'wedding',
    budget: 500000,
    guestCount: 150,
    style: 'traditional',
    setting: 'indoor',
  });

  const outdoor = calculateBudget({
    eventType: 'wedding',
    budget: 500000,
    guestCount: 150,
    style: 'traditional',
    setting: 'outdoor',
  });

  const indoorVenue = indoor.categories.find(c => c.id === 'venue_decor');
  const outdoorVenue = outdoor.categories.find(c => c.id === 'venue_decor');

  assert.ok(
    outdoorVenue.amount >= indoorVenue.amount,
    'Outdoor venue budget should account for shamiana and weather protection.'
  );
  assert.match(outdoorVenue.reasonEn, /shamiana|weather/i);
});

test('Spend tracker: Computes variance, status, and net remaining correctly', () => {
  const budgetPlan = calculateBudget({
    eventType: 'birthday',
    budget: 100000,
    guestCount: 50,
    style: 'modern',
    setting: 'indoor',
  });

  const sampleActuals = {
    venue_decor: 30000,
    catering_cake: 35000,
  };

  const tracker = calculateSpendTracker(budgetPlan.categories, sampleActuals);
  assert.strictEqual(tracker.totalBudgeted, 100000);
  assert.strictEqual(tracker.totalActual, 65000);
  assert.strictEqual(tracker.totalRemaining, 35000);

  const venueCat = tracker.categories.find(c => c.id === 'venue_decor');
  assert.strictEqual(venueCat.actual, 30000);
  assert.strictEqual(venueCat.variance, venueCat.budgeted - 30000);
});

test('Ceremony pathway: Generates sequential ceremony steps for celebrations', () => {
  const weddingPathway = generateCeremonyPathway({ eventType: 'wedding' });
  assert.strictEqual(weddingPathway.length, 5);
  const ids = weddingPathway.map(s => s.id);
  assert.deepStrictEqual(ids, ['haldi', 'mehendi', 'sangeet', 'vivah', 'reception']);

  // Ensure all steps have bilingual names, timings, dress codes, and highlights
  for (const step of weddingPathway) {
    assert.ok(step.nameEn && step.nameHi, `Step ${step.id} must have bilingual name`);
    assert.ok(step.timingEn && step.timingHi, `Step ${step.id} must have bilingual timing`);
    assert.ok(step.dressCodeEn && step.dressCodeHi, `Step ${step.id} must have bilingual dress code`);
    assert.ok(step.highlightEn && step.highlightHi, `Step ${step.id} must have bilingual highlight`);
  }

  const birthdayPathway = generateCeremonyPathway({ eventType: 'birthday' });
  assert.ok(birthdayPathway.some(s => s.id === 'cake'));
  for (const step of birthdayPathway) {
    assert.ok(step.nameEn && step.nameHi);
  }

  const communityPathway = generateCeremonyPathway({ eventType: 'community' });
  assert.ok(communityPathway.some(s => s.id === 'bhog'));
  for (const step of communityPathway) {
    assert.ok(step.nameEn && step.nameHi);
  }
});
