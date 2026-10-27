/**
 * Share Plan serialization, export, and import module for UtsavPlan.
 * Enables URL hash sharing and JSON file export/import for family and co-planners.
 * Ensures vendor phone numbers and advance payments are strictly excluded from public shares.
 */

import { sanitizeNotes } from './validator.js';

const ALLOWED_EVENT_TYPES = ['wedding', 'birthday', 'community'];
const ALLOWED_STYLES = ['traditional', 'modern', 'royal', 'minimalist', 'festive', 'eco-friendly'];
const ALLOWED_SETTINGS = ['indoor', 'outdoor', 'hybrid'];
const ALLOWED_THEMES = ['royal-rajwada', 'udaipur-palace', 'peacock-regalia', 'boho-sundowner'];

/**
 * Encodes plan configuration and checked task IDs into a URL-safe compact string.
 * Uses compact single-letter keys to keep the URL concise.
 * @param {object} formValues
 * @param {string[]|Set<string>} [checkedTasks]
 * @returns {string} Base64-encoded string
 */
export function serializePlanForUrl(formValues, checkedTasks = []) {
  if (!formValues || typeof formValues !== 'object') return '';

  const tasksArray = Array.isArray(checkedTasks)
    ? checkedTasks
    : Array.from(checkedTasks || []);

  const compact = {
    v: 1,
    e: String(formValues.eventType || 'wedding').trim().toLowerCase(),
    d: String(formValues.date || '').trim(),
    g: Math.max(1, parseInt(formValues.guestCount, 10) || 100),
    b: Math.max(1000, parseInt(formValues.budget, 10) || 100000),
    s: String(formValues.style || 'traditional').trim().toLowerCase(),
    th: String(formValues.theme || 'royal-rajwada').trim().toLowerCase(),
    st: String(formValues.setting || 'indoor').trim().toLowerCase(),
    dt: Array.isArray(formValues.dietary) ? formValues.dietary : [],
    ch: formValues.children ? 1 : 0,
    n: sanitizeNotes(String(formValues.notes || '')),
    ct: tasksArray.map(t => String(t).slice(0, 50)),
  };

  const jsonStr = JSON.stringify(compact);

  // In Node.js:
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(jsonStr, 'utf-8').toString('base64url');
  }

  // In Browser:
  return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  )).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes compact URL string back into event configuration.
 * @param {string} encoded
 * @returns {object|null} Decoded event inputs and checked tasks, or null if invalid
 */
export function deserializePlanFromUrl(encoded) {
  if (!encoded || typeof encoded !== 'string') return null;

  try {
    let clean = encoded.trim();
    // Support either full hash like #plan=XYZ or bare XYZ
    if (clean.includes('plan=')) {
      clean = clean.split('plan=')[1].split('&')[0];
    } else if (clean.startsWith('#')) {
      clean = clean.slice(1);
    }

    let jsonStr = '';
    if (typeof Buffer !== 'undefined') {
      jsonStr = Buffer.from(clean, 'base64url').toString('utf-8');
    } else {
      let b64 = clean.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      jsonStr = decodeURIComponent(
        Array.prototype.map.call(atob(b64), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
    }

    const compact = JSON.parse(jsonStr);
    if (!compact || typeof compact !== 'object') return null;

    return {
      eventType: ALLOWED_EVENT_TYPES.includes(compact.e) ? compact.e : 'wedding',
      date: typeof compact.d === 'string' ? compact.d : '',
      guestCount: Math.max(1, parseInt(compact.g, 10) || 100),
      budget: Math.max(1000, parseInt(compact.b, 10) || 100000),
      style: ALLOWED_STYLES.includes(compact.s) ? compact.s : 'traditional',
      theme: ALLOWED_THEMES.includes(compact.th) ? compact.th : 'royal-rajwada',
      setting: ALLOWED_SETTINGS.includes(compact.st) ? compact.st : 'indoor',
      dietary: Array.isArray(compact.dt) ? compact.dt : [],
      children: Boolean(compact.ch),
      notes: sanitizeNotes(String(compact.n || '')),
      checkedTasks: Array.isArray(compact.ct) ? compact.ct : [],
    };
  } catch (err) {
    return null;
  }
}

/**
 * Builds a clean, exportable JSON object for family and co-planners.
 * Guarantees that private vendor phone numbers and payment advances are excluded.
 * @param {object} formValues
 * @param {object} [planData]
 * @param {string[]|Set<string>} [checkedTasks]
 * @returns {object} Clean export payload
 */
export function buildPlanJsonExport(formValues, planData = null, checkedTasks = []) {
  const tasksArray = Array.isArray(checkedTasks)
    ? checkedTasks
    : Array.from(checkedTasks || []);

  const exportPayload = {
    app: 'UtsavPlan',
    schemaVersion: '1.0',
    exportedAt: new Date().toISOString(),
    event: {
      eventType: formValues.eventType || 'wedding',
      date: formValues.date || '',
      guestCount: parseInt(formValues.guestCount, 10) || 100,
      budget: parseInt(formValues.budget, 10) || 100000,
      style: formValues.style || 'traditional',
      theme: formValues.theme || 'royal-rajwada',
      setting: formValues.setting || 'indoor',
      dietary: Array.isArray(formValues.dietary) ? formValues.dietary : [],
      children: Boolean(formValues.children),
      notes: sanitizeNotes(String(formValues.notes || '')),
    },
    checkedTasks: tasksArray,
  };

  if (planData && typeof planData === 'object') {
    exportPayload.planSummary = {
      leadTimeDays: planData.timeline?.leadTimeDays || 0,
      totalBudgetAllocated: planData.budget?.total || formValues.budget,
      perGuestBudget: planData.budget?.perGuest || 0,
      ideasCount: Array.isArray(planData.ideas) ? planData.ideas.length : 0,
      pathwayStepsCount: Array.isArray(planData.ceremonyPathway) ? planData.ceremonyPathway.length : 0,
    };
  }

  return exportPayload;
}

/**
 * Validates and extracts event data from an imported JSON file.
 * @param {string|object} input
 * @returns {{ valid: boolean, event?: object, checkedTasks?: string[], error?: string }}
 */
export function validateAndParsePlanJson(input) {
  let parsed = input;
  if (typeof input === 'string') {
    try {
      parsed = JSON.parse(input);
    } catch {
      return { valid: false, error: 'File is not a valid JSON document.' };
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Invalid JSON payload format.' };
  }

  // Support either exported payload format ({ app: 'UtsavPlan', event: {...} }) or direct event object
  const evt = parsed.event || parsed;

  if (!evt || typeof evt !== 'object') {
    return { valid: false, error: 'No event details found in JSON file.' };
  }

  const rawEventType = String(evt.eventType || '').trim().toLowerCase();
  if (!ALLOWED_EVENT_TYPES.includes(rawEventType)) {
    return { valid: false, error: `Invalid or missing event type: "${rawEventType}".` };
  }

  const rawBudget = parseInt(evt.budget, 10);
  if (Number.isNaN(rawBudget) || rawBudget <= 0) {
    return { valid: false, error: 'Invalid or non-positive budget.' };
  }

  const rawGuestCount = parseInt(evt.guestCount, 10);
  if (Number.isNaN(rawGuestCount) || rawGuestCount <= 0) {
    return { valid: false, error: 'Invalid or non-positive guest count.' };
  }

  const cleanEvent = {
    eventType: rawEventType,
    date: typeof evt.date === 'string' ? evt.date.trim() : '',
    guestCount: rawGuestCount,
    budget: rawBudget,
    style: ALLOWED_STYLES.includes(evt.style) ? evt.style : 'traditional',
    theme: ALLOWED_THEMES.includes(evt.theme) ? evt.theme : 'royal-rajwada',
    setting: ALLOWED_SETTINGS.includes(evt.setting) ? evt.setting : 'indoor',
    dietary: Array.isArray(evt.dietary) ? evt.dietary : [],
    children: Boolean(evt.children),
    notes: sanitizeNotes(String(evt.notes || '')),
  };

  const tasks = Array.isArray(parsed.checkedTasks) ? parsed.checkedTasks : [];

  return {
    valid: true,
    event: cleanEvent,
    checkedTasks: tasks,
  };
}
