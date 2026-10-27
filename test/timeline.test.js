import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTimeline } from '../src/planner.js';

test('Timeline: Generates real calendar dates counted backwards from event date', () => {
  const eventDate = '2027-01-01';
  const today = new Date('2026-06-01T00:00:00Z');

  const result = calculateTimeline({
    eventType: 'wedding',
    eventDate,
    today,
  });

  assert.ok(result.milestones.length > 0);
  assert.strictEqual(result.eventDate, eventDate);

  // Check event-day milestone
  const eventDayMilestone = result.milestones.find(m => m.daysBefore === 0);
  assert.ok(eventDayMilestone, 'Must have an event day milestone');
  assert.strictEqual(eventDayMilestone.date, '2027-01-01');

  // Check 180 days before milestone
  const sixMonthMilestone = result.milestones.find(m => m.daysBefore === 180);
  assert.ok(sixMonthMilestone, 'Should have milestone 180 days before');
  assert.ok(sixMonthMilestone.date < eventDate, 'Milestone date must be earlier than event date');
});

test('Timeline compression: Merges early tasks into "Start now" when lead time is short', () => {
  const eventDate = '2026-11-01';
  // Today is only 10 days before the wedding
  const today = new Date('2026-10-22T00:00:00Z');

  const result = calculateTimeline({
    eventType: 'wedding',
    eventDate,
    today,
  });

  // Since lead time is ~10 days, earlier milestones (180, 120, 90, 60, 30, 14 days before) must be compressed!
  const startNow = result.milestones.find(m => m.isStartNow);
  assert.ok(startNow, 'Compressed timeline must have a "Start now" milestone');
  assert.match(startNow.titleEn, /Start now/i);
  assert.strictEqual(startNow.date, '2026-10-22');
});

test('Timeline sub-tasks: Generates detailed, bilingual sub-tasks for all celebration types', async () => {
  const { getMilestoneSubtasks } = await import('../src/timeline-subtasks.js');
  const { TRANSLATIONS, t } = await import('../src/i18n.js');

  // Verify i18n labels exist in both languages
  assert.ok(TRANSLATIONS.en.expandAll, 'English expandAll label must exist');
  assert.ok(TRANSLATIONS.hi.expandAll, 'Hindi expandAll label must exist');
  assert.ok(TRANSLATIONS.en.collapseAll, 'English collapseAll label must exist');
  assert.ok(TRANSLATIONS.hi.collapseAll, 'Hindi collapseAll label must exist');
  assert.ok(TRANSLATIONS.en.detailedSubtasks, 'English detailedSubtasks label must exist');
  assert.ok(TRANSLATIONS.hi.detailedSubtasks, 'Hindi detailedSubtasks label must exist');

  assert.strictEqual(t('en', 'expandAll'), 'Expand all');
  assert.strictEqual(t('hi', 'expandAll'), 'सभी विस्तार करें');
  assert.strictEqual(t('en', 'collapseAll'), 'Collapse all');
  assert.strictEqual(t('hi', 'collapseAll'), 'सभी संक्षेप करें');

  // 1. Wedding milestone subtasks
  const weddingMilestone180 = { daysBefore: 180, titleEn: 'Venue', titleHi: 'वेन्यू' };
  const weddingTasks180 = getMilestoneSubtasks(weddingMilestone180, 'wedding');
  assert.ok(Array.isArray(weddingTasks180) && weddingTasks180.length >= 3, 'Must have at least 3 sub-tasks');
  weddingTasks180.forEach(st => {
    assert.ok(st.id, 'Sub-task must have an id');
    assert.ok(st.textEn && typeof st.textEn === 'string', 'Sub-task must have English text');
    assert.ok(st.textHi && typeof st.textHi === 'string', 'Sub-task must have Hindi text');
    assert.ok(!st.textEn.includes('<'), 'Sub-task text must not contain raw HTML');
  });

  // 2. Birthday milestone subtasks
  const birthdayMilestone = { daysBefore: 30, titleEn: 'Custom Cake', titleHi: 'केक' };
  const birthdayTasks = getMilestoneSubtasks(birthdayMilestone, 'birthday');
  assert.ok(Array.isArray(birthdayTasks) && birthdayTasks.length >= 3);
  birthdayTasks.forEach(st => {
    assert.ok(st.id && st.textEn && st.textHi);
  });

  // 3. Community event milestone subtasks
  const commMilestone = { daysBefore: 25, titleEn: 'Stage Truss & Generator', titleHi: 'मंच एवं जनरेटर' };
  const commTasks = getMilestoneSubtasks(commMilestone, 'community');
  assert.ok(Array.isArray(commTasks) && commTasks.length >= 3);
  commTasks.forEach(st => {
    assert.ok(st.id && st.textEn && st.textHi);
  });

  // 4. Compressed urgent start-now milestone
  const urgentMilestone = { isStartNow: true, daysBefore: 5, titleEn: 'Start now', titleHi: 'तुरंत शुरू करें' };
  const urgentTasks = getMilestoneSubtasks(urgentMilestone, 'wedding');
  assert.ok(Array.isArray(urgentTasks) && urgentTasks.length >= 3);
  urgentTasks.forEach(st => {
    assert.ok(st.id && st.textEn && st.textHi);
  });

  // 5. Pre-provided milestone subtasks are preserved
  const customMilestone = {
    daysBefore: 10,
    subtasks: [
      { id: 'custom_1', textEn: 'Custom task 1', textHi: 'कस्टम कार्य 1' },
    ],
  };
  const preservedTasks = getMilestoneSubtasks(customMilestone, 'wedding');
  assert.strictEqual(preservedTasks.length, 1);
  assert.strictEqual(preservedTasks[0].id, 'custom_1');
});

