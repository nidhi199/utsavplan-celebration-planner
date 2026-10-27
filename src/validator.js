/**
 * Input validation and sanitization module for celebration planner.
 * Enforces strict typing, value ranges, allowed options, and sanitizes free-text notes.
 */

import { ALLOWED_TRADITION_IDS } from './traditions.js';

const ALLOWED_EVENT_TYPES = ['wedding', 'birthday', 'community'];
const ALLOWED_STYLES = ['traditional', 'modern', 'royal', 'minimalist', 'festive', 'eco-friendly'];
const ALLOWED_SETTINGS = ['indoor', 'outdoor', 'hybrid'];
const ALLOWED_DIETARY = ['jain', 'satvik', 'vegetarian', 'non-vegetarian', 'vegan', 'gluten-free'];

/**
 * Sanitizes free-text user notes.
 * Removes HTML tags, script markers, dangerous characters, and trims length.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeNotes(input) {
  if (typeof input !== 'string') return '';
  // Strip HTML tags and control characters
  let cleaned = input
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim();

  // Limit length to 1000 characters
  if (cleaned.length > 1000) {
    cleaned = cleaned.slice(0, 1000);
  }
  return cleaned;
}

/**
 * Validates and sanitizes plan creation payload.
 * @param {object} payload
 * @returns {{ valid: boolean, errors: string[], data: object }}
 */
export function validatePlanInput(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Request body must be a valid JSON object.'], data: null };
  }

  // 1. Event Type
  const rawEventType = String(payload.eventType || '').trim().toLowerCase();
  if (!ALLOWED_EVENT_TYPES.includes(rawEventType)) {
    errors.push(`Invalid event type. Allowed: ${ALLOWED_EVENT_TYPES.join(', ')}.`);
  }

  // 2. Date
  const rawDate = String(payload.date || '').trim();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(rawDate)) {
    errors.push('Event date must be in YYYY-MM-DD format.');
  } else {
    const parsedDate = new Date(`${rawDate}T00:00:00Z`);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push('Event date is not a valid calendar date.');
    } else {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      if (parsedDate < today) {
        errors.push('Event date cannot be in the past.');
      }
    }
  }

  // 3. Guest Count
  const guestCount = Number(payload.guestCount);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100000) {
    errors.push('Guest count must be an integer between 1 and 100,000.');
  }

  // 4. Budget (in INR)
  const budget = Number(payload.budget);
  if (typeof budget !== 'number' || Number.isNaN(budget) || budget < 1000 || budget > 1000000000) {
    errors.push('Budget must be an amount in INR between 1,000 and 1,000,000,000.');
  }

  // 5. Style
  const rawStyle = String(payload.style || 'traditional').trim().toLowerCase();
  if (!ALLOWED_STYLES.includes(rawStyle)) {
    errors.push(`Style must be one of: ${ALLOWED_STYLES.join(', ')}.`);
  }

  // 6. Setting (Indoor / Outdoor / Hybrid)
  const rawSetting = String(payload.setting || 'indoor').trim().toLowerCase();
  if (!ALLOWED_SETTINGS.includes(rawSetting)) {
    errors.push(`Setting must be one of: ${ALLOWED_SETTINGS.join(', ')}.`);
  }

  // 7. Dietary preferences
  let dietary = [];
  if (Array.isArray(payload.dietary)) {
    dietary = payload.dietary
      .map(d => String(d).trim().toLowerCase())
      .filter(d => ALLOWED_DIETARY.includes(d));
  } else if (typeof payload.dietary === 'string' && payload.dietary.trim()) {
    const splitted = payload.dietary.toLowerCase().split(/[, ]+/);
    dietary = splitted.filter(d => ALLOWED_DIETARY.includes(d));
  }
  // Deduplicate dietary tags
  dietary = Array.from(new Set(dietary));

  // 8. Children attending
  const children = Boolean(payload.children);

  // 9. Free-text notes
  const notes = sanitizeNotes(payload.notes || '');

  // 10. Decor & Color Palette Theme
  const ALLOWED_THEMES = ['royal-rajwada', 'udaipur-palace', 'peacock-regalia', 'boho-sundowner'];
  const rawTheme = String(payload.theme || 'royal-rajwada').trim().toLowerCase();
  const theme = ALLOWED_THEMES.includes(rawTheme) ? rawTheme : 'royal-rajwada';

  // 11. Wedding tradition (optional, only for wedding, strictly validated)
  let tradition = null;
  if (payload.tradition !== undefined && payload.tradition !== null && String(payload.tradition).trim() !== '') {
    const rawTradition = String(payload.tradition).trim().toLowerCase();
    if (rawEventType !== 'wedding') {
      errors.push('Wedding tradition can only be specified for wedding events.');
    } else if (!ALLOWED_TRADITION_IDS.includes(rawTradition)) {
      errors.push(`Wedding tradition must be one of: ${ALLOWED_TRADITION_IDS.join(', ')}.`);
    } else {
      tradition = rawTradition;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  const cleanData = {
    eventType: rawEventType,
    date: rawDate,
    guestCount,
    budget: Math.round(budget),
    style: rawStyle,
    theme,
    setting: rawSetting,
    dietary,
    children,
    notes,
  };

  if (tradition) {
    cleanData.tradition = tradition;
  }

  return {
    valid: true,
    errors: [],
    data: cleanData,
  };
}
