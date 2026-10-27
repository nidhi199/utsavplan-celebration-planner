import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDraft,
  validateDraft,
  formatDraftTimestamp,
  isStorageAvailable,
  listDrafts,
  loadDraft,
  saveDraft,
  renameDraft,
  deleteDraft,
  MAX_DRAFTS,
  DRAFTS_STORAGE_KEY,
} from '../src/drafts.js';
import { TRANSLATIONS } from '../src/i18n.js';

function createMockStorage(initialData = {}) {
  const store = new Map(Object.entries(initialData));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    get size() {
      return store.size;
    },
  };
}

test('Save and load roundtrip works properly', () => {
  const storage = createMockStorage();
  const draft = createDraft({
    id: 'test_draft_1',
    name: 'Diwali Gala 2026',
    formValues: {
      eventType: 'Diwali Party',
      budget: 150000,
      guests: 75,
      date: '2026-11-01',
      city: 'Jaipur',
    },
    theme: 'royal-rajwada',
    lang: 'en',
    actualSpends: { decor: 40000 },
    vendorDetails: { caterer: 'Spice Kitchen' },
    checkedTasks: ['venue_booking'],
  });

  const saveRes = saveDraft(draft, storage);
  assert.equal(saveRes.success, true);

  const loaded = loadDraft('test_draft_1', storage);
  assert.ok(loaded);
  assert.equal(loaded.id, 'test_draft_1');
  assert.equal(loaded.name, 'Diwali Gala 2026');
  assert.equal(loaded.formValues.budget, 150000);
  assert.equal(loaded.actualSpends.decor, 40000);
  assert.equal(loaded.vendorDetails.caterer, 'Spice Kitchen');
  assert.deepEqual(loaded.checkedTasks, ['venue_booking']);
});

test('10 draft limit is strictly enforced', () => {
  const storage = createMockStorage();

  // Save 10 drafts
  for (let i = 1; i <= MAX_DRAFTS; i++) {
    const draft = createDraft({
      id: `draft_${i}`,
      name: `Celebration ${i}`,
      formValues: { eventType: 'Birthday', budget: 50000 },
      theme: 'marigold-festive',
      lang: 'en',
      savedAt: new Date(2026, 0, i).toISOString(),
    });
    const res = saveDraft(draft, storage);
    assert.equal(res.success, true, `Draft ${i} should save`);
  }

  const list = listDrafts(storage);
  assert.equal(list.length, MAX_DRAFTS);

  // 11th draft should be rejected
  const eleventhDraft = createDraft({
    id: 'draft_11',
    name: 'Celebration 11',
    formValues: { eventType: 'Wedding', budget: 1000000 },
    theme: 'royal-rajwada',
    lang: 'en',
  });

  const eleventhRes = saveDraft(eleventhDraft, storage);
  assert.equal(eleventhRes.success, false);
  assert.equal(eleventhRes.error, 'LIMIT_REACHED');
  assert.equal(eleventhRes.count, 10);
  assert.equal(eleventhRes.maxDrafts, 10);

  // Updating an existing draft should still succeed even when at 10
  const existingUpdated = {
    ...list[0],
    name: 'Updated Name',
  };
  const updateRes = saveDraft(existingUpdated, storage);
  assert.equal(updateRes.success, true);
});

test('Corrupt entries in storage are ignored safely', () => {
  const storage = createMockStorage();
  const validDraft = createDraft({
    id: 'valid_1',
    name: 'Valid Wedding Draft',
    formValues: { eventType: 'Wedding' },
    theme: 'royal-rajwada',
    lang: 'en',
  });

  const corruptItems = [
    null,
    undefined,
    'not an object',
    { id: '' }, // missing id
    { id: 'bad1', name: '' }, // missing name
    { id: 'bad2', name: 'Valid', formValues: null }, // bad formValues
    { id: 'bad3', name: 'Valid', formValues: {}, theme: '' }, // missing theme
    { id: 'bad4', name: 'Valid', formValues: {}, theme: 't', lang: '' }, // missing lang
    { id: 'bad5', name: 'Valid', formValues: {}, theme: 't', lang: 'en', savedAt: 'invalid-date' }, // invalid savedAt
    validDraft,
  ];

  storage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(corruptItems));

  const list = listDrafts(storage);
  assert.equal(list.length, 1);
  assert.equal(list[0].id, 'valid_1');
});

test('Rename and delete draft work correctly', () => {
  const storage = createMockStorage();
  const draft1 = createDraft({
    id: 'd1',
    name: 'Original Name',
    formValues: { eventType: 'Anniversary' },
  });
  const draft2 = createDraft({
    id: 'd2',
    name: 'Second Event',
    formValues: { eventType: 'Birthday' },
  });

  saveDraft(draft1, storage);
  saveDraft(draft2, storage);

  // Rename d1
  const renameRes = renameDraft('d1', 'Renamed Anniversary', storage);
  assert.equal(renameRes.success, true);
  const loadedD1 = loadDraft('d1', storage);
  assert.equal(loadedD1.name, 'Renamed Anniversary');

  // Delete d2
  const deleteRes = deleteDraft('d2', storage);
  assert.equal(deleteRes.success, true);
  assert.equal(loadDraft('d2', storage), null);

  const remaining = listDrafts(storage);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].id, 'd1');
});

test('Timestamp format supports both en-IN and hi-IN', () => {
  const iso = '2026-10-25T14:30:00.000Z';

  const formattedEn = formatDraftTimestamp(iso, 'en');
  assert.ok(formattedEn && typeof formattedEn === 'string');
  assert.ok(formattedEn.includes('2026'));

  const formattedHi = formatDraftTimestamp(iso, 'hi');
  assert.ok(formattedHi && typeof formattedHi === 'string');
  assert.ok(formattedHi.includes('2026'));

  // Invalid timestamp returns empty string gracefully
  assert.equal(formatDraftTimestamp('invalid-date-string'), '');
});

test('Drafts i18n keys exist symmetrically in both languages', () => {
  const requiredKeys = [
    'saveDraftBtn',
    'headerDraftsBtn',
    'draftsModalTitle',
    'draftsModalDesc',
    'draftsStorageWarning',
    'storageUnavailableWarning',
    'noDraftsMessage',
    'draftSavedStatus',
    'draftDeletedStatus',
    'draftRenamedStatus',
    'draftLoadedStatus',
    'draftLoadBtn',
    'draftRenameBtn',
    'draftDeleteBtn',
    'saveDraftModalTitle',
    'lblDraftName',
    'saveDraftConfirmBtn',
    'renameDraftModalTitle',
    'lblRenameDraft',
    'confirmRenameBtn',
    'deleteDraftModalTitle',
    'confirmDeleteDraftText',
    'confirmDeleteBtn',
  ];

  for (const key of requiredKeys) {
    assert.ok(TRANSLATIONS.en[key], `Missing English key: ${key}`);
    assert.ok(TRANSLATIONS.hi[key], `Missing Hindi key: ${key}`);
    assert.equal(typeof TRANSLATIONS.en[key], 'string');
    assert.equal(typeof TRANSLATIONS.hi[key], 'string');
  }
});
