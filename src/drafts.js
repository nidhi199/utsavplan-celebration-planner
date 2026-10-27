/**
 * UtsavPlan Drafts Module
 * Pure functions for creating, listing, loading, renaming, deleting, and validating drafts.
 * LocalStorage only. Never transmitted to server or AI providers.
 */

export const MAX_DRAFTS = 10;
export const MAX_NAME_LENGTH = 60;
export const MAX_DRAFTS_STORAGE_BYTES = 500 * 1024; // 500 KB limit
export const DRAFTS_STORAGE_KEY = 'utsavplan_drafts';

/**
 * Validates a single draft object.
 * Returns true if valid, false if corrupt.
 * @param {any} draft
 * @returns {boolean}
 */
export function validateDraft(draft) {
  if (!draft || typeof draft !== 'object') return false;
  if (typeof draft.id !== 'string' || !draft.id.trim()) return false;
  if (typeof draft.name !== 'string' || !draft.name.trim() || draft.name.length > MAX_NAME_LENGTH) return false;
  if (typeof draft.savedAt !== 'string') return false;
  const time = new Date(draft.savedAt).getTime();
  if (isNaN(time)) return false;
  if (!draft.formValues || typeof draft.formValues !== 'object') return false;
  if (typeof draft.theme !== 'string' || !draft.theme) return false;
  if (typeof draft.lang !== 'string' || !draft.lang) return false;

  // actualSpends and vendorDetails should be objects if provided
  if (draft.actualSpends !== undefined && (typeof draft.actualSpends !== 'object' || draft.actualSpends === null)) {
    return false;
  }
  if (draft.vendorDetails !== undefined && (typeof draft.vendorDetails !== 'object' || draft.vendorDetails === null)) {
    return false;
  }

  return true;
}

/**
 * Generates a default name if user does not provide one: event type + date.
 * @param {string} [eventType]
 * @param {string} [date]
 * @returns {string}
 */
export function generateDefaultDraftName(eventType, date) {
  const typeStr = eventType ? String(eventType).trim() : 'Event';
  const dateStr = date ? String(date).trim() : 'Undated';
  const combined = `${typeStr} - ${dateStr}`;
  return combined.slice(0, MAX_NAME_LENGTH);
}

/**
 * Creates a normalized draft object.
 * @param {object} params
 * @returns {object}
 */
export function createDraft({
  id,
  name,
  formValues,
  theme = 'royal-rajwada',
  lang = 'en',
  actualSpends = {},
  vendorDetails = {},
  checkedTasks = [],
  savedAt,
} = {}) {
  const finalId = (id && typeof id === 'string' && id.trim())
    ? id.trim()
    : `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  let finalName = '';
  if (name && typeof name === 'string' && name.trim()) {
    finalName = name.trim().slice(0, MAX_NAME_LENGTH);
  } else {
    const evtType = formValues && formValues.eventType;
    const evtDate = formValues && formValues.date;
    finalName = generateDefaultDraftName(evtType, evtDate);
  }

  return {
    id: finalId,
    name: finalName,
    formValues: formValues && typeof formValues === 'object' ? { ...formValues } : {},
    theme: String(theme || 'royal-rajwada'),
    lang: String(lang || 'en'),
    actualSpends: actualSpends && typeof actualSpends === 'object' ? { ...actualSpends } : {},
    vendorDetails: vendorDetails && typeof vendorDetails === 'object' ? { ...vendorDetails } : {},
    checkedTasks: Array.isArray(checkedTasks) ? [...checkedTasks] : [],
    savedAt: savedAt || new Date().toISOString(),
  };
}

/**
 * Formats ISO timestamp for active language: en-IN or hi-IN.
 * @param {string} isoString
 * @param {string} [lang='en']
 * @returns {string}
 */
export function formatDraftTimestamp(isoString, lang = 'en') {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const locale = (lang === 'hi' || lang === 'hi-IN') ? 'hi-IN' : 'en-IN';
  try {
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return date.toISOString();
  }
}

/**
 * Checks if storage is accessible without throwing.
 * @param {Storage|object|null} storage
 * @returns {boolean}
 */
export function isStorageAvailable(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!storage) return false;
  try {
    const testKey = '__utsavplan_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Reads all drafts from storage, ignores corrupt entries, returns sorted newest first.
 * @param {Storage|object|null} storage
 * @returns {Array<object>}
 */
export function listDrafts(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!isStorageAvailable(storage)) return [];
  try {
    const raw = storage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and validate every entry, ignoring corrupt items
    const validDrafts = parsed.filter(item => validateDraft(item));

    // Sort newest first
    validDrafts.sort((a, b) => {
      const timeA = new Date(a.savedAt).getTime() || 0;
      const timeB = new Date(b.savedAt).getTime() || 0;
      return timeB - timeA;
    });

    return validDrafts;
  } catch (e) {
    return [];
  }
}

/**
 * Loads a single draft by ID from storage.
 * @param {string} id
 * @param {Storage|object|null} storage
 * @returns {object|null}
 */
export function loadDraft(id, storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!id) return null;
  const drafts = listDrafts(storage);
  return drafts.find(d => d.id === id) || null;
}

/**
 * Saves a draft to storage.
 * Enforces 10 draft maximum limit and storage size limit.
 * @param {object} draft
 * @param {Storage|object|null} storage
 * @returns {{ success: boolean, error?: string, maxDrafts?: number, count?: number, draft?: object, drafts?: Array<object> }}
 */
export function saveDraft(draft, storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!isStorageAvailable(storage)) {
    return { success: false, error: 'STORAGE_UNAVAILABLE' };
  }
  if (!validateDraft(draft)) {
    return { success: false, error: 'INVALID_DRAFT' };
  }

  const existingDrafts = listDrafts(storage);
  const existingIndex = existingDrafts.findIndex(d => d.id === draft.id);

  let updatedDrafts;
  if (existingIndex >= 0) {
    // Updating existing draft
    updatedDrafts = [...existingDrafts];
    updatedDrafts[existingIndex] = draft;
  } else {
    // New draft: check 10 limit
    if (existingDrafts.length >= MAX_DRAFTS) {
      return {
        success: false,
        error: 'LIMIT_REACHED',
        maxDrafts: MAX_DRAFTS,
        count: existingDrafts.length,
      };
    }
    updatedDrafts = [draft, ...existingDrafts];
  }

  // Sort newest first
  updatedDrafts.sort((a, b) => (new Date(b.savedAt).getTime() || 0) - (new Date(a.savedAt).getTime() || 0));

  try {
    const serialized = JSON.stringify(updatedDrafts);
    if (serialized.length > MAX_DRAFTS_STORAGE_BYTES) {
      return { success: false, error: 'SIZE_EXCEEDED' };
    }
    storage.setItem(DRAFTS_STORAGE_KEY, serialized);
    return { success: true, draft, drafts: updatedDrafts };
  } catch (e) {
    return { success: false, error: 'STORAGE_ERROR', originalError: e.message };
  }
}

/**
 * Renames a draft in storage.
 * @param {string} id
 * @param {string} newName
 * @param {Storage|object|null} storage
 * @returns {{ success: boolean, error?: string, draft?: object, drafts?: Array<object> }}
 */
export function renameDraft(id, newName, storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!isStorageAvailable(storage)) {
    return { success: false, error: 'STORAGE_UNAVAILABLE' };
  }
  if (!id || typeof newName !== 'string' || !newName.trim()) {
    return { success: false, error: 'INVALID_NAME' };
  }

  const drafts = listDrafts(storage);
  const targetIndex = drafts.findIndex(d => d.id === id);
  if (targetIndex < 0) {
    return { success: false, error: 'NOT_FOUND' };
  }

  const trimmedName = newName.trim().slice(0, MAX_NAME_LENGTH);
  const updatedDraft = {
    ...drafts[targetIndex],
    name: trimmedName,
    savedAt: new Date().toISOString(),
  };

  drafts[targetIndex] = updatedDraft;
  drafts.sort((a, b) => (new Date(b.savedAt).getTime() || 0) - (new Date(a.savedAt).getTime() || 0));

  try {
    storage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    return { success: true, draft: updatedDraft, drafts };
  } catch (e) {
    return { success: false, error: 'STORAGE_ERROR', originalError: e.message };
  }
}

/**
 * Deletes a draft from storage.
 * @param {string} id
 * @param {Storage|object|null} storage
 * @returns {{ success: boolean, error?: string, drafts?: Array<object> }}
 */
export function deleteDraft(id, storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!isStorageAvailable(storage)) {
    return { success: false, error: 'STORAGE_UNAVAILABLE' };
  }
  if (!id) return { success: false, error: 'INVALID_ID' };

  const drafts = listDrafts(storage);
  const filtered = drafts.filter(d => d.id !== id);

  try {
    storage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
    return { success: true, drafts: filtered };
  } catch (e) {
    return { success: false, error: 'STORAGE_ERROR', originalError: e.message };
  }
}
