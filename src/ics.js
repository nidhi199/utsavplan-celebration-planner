/**
 * Generates RFC 5545 compliant iCalendar (.ics) export for celebration timelines.
 * Uses pure JavaScript with zero external dependencies.
 */

function escapeIcsText(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function formatDateIcs(dateStr) {
  // Converts YYYY-MM-DD to YYYYMMDD
  return dateStr.replace(/-/g, '');
}

function getNextDayIcs(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Builds standard RFC 5545 calendar string from timeline milestones.
 * @param {object} params
 * @param {string} params.eventName
 * @param {Array<object>} params.milestones
 * @param {string} [params.lang]
 * @returns {string}
 */
export function generateIcs({ eventName = 'Celebration Milestone', milestones = [], lang = 'en' }) {
  const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UtsavPlan//Event Celebration Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(eventName)} Timeline`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  milestones.forEach((m, idx) => {
    if (!m.date) return;
    const title = lang === 'hi' && m.titleHi ? m.titleHi : m.titleEn || m.title;
    const summary = `${eventName}: ${title}`;
    const dtStart = formatDateIcs(m.date);
    const dtEnd = getNextDayIcs(m.date);
    const uid = `utsav-${Date.now()}-${idx}-${dtStart}@utsavplan.local`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    lines.push(`SUMMARY:${escapeIcsText(summary)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(`Milestone for ${eventName}. Phase: ${m.phase || 'Preparation'}. Days before event: ${m.daysBefore}`)}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('TRANSP:TRANSPARENT');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
