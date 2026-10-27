import test from 'node:test';
import assert from 'node:assert/strict';
import { generateIcs } from '../src/ics.js';

test('ICS Export: Generates RFC 5545 compliant calendar file', () => {
  const milestones = [
    {
      daysBefore: 60,
      date: '2027-01-15',
      titleEn: 'Send invitations, book caterer; confirm Haldi & Mehendi',
      phase: 'mid-term',
    },
    {
      daysBefore: 0,
      date: '2027-03-16',
      titleEn: 'Wedding Celebration Day!',
      phase: 'event-day',
    },
  ];

  const ics = generateIcs({
    eventName: 'Sharma-Verma Wedding',
    milestones,
    lang: 'en',
  });

  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'), 'Must start with BEGIN:VCALENDAR');
  assert.ok(ics.includes('VERSION:2.0\r\n'), 'Must specify VERSION:2.0');
  assert.ok(ics.includes('PRODID:-//UtsavPlan//Event Celebration Planner//EN'), 'Must contain PRODID');
  assert.ok(ics.includes('BEGIN:VEVENT\r\n'), 'Must contain VEVENT');
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20270115'), 'Must format start date correctly as YYYYMMDD');
  assert.ok(ics.includes('DTEND;VALUE=DATE:20270116'), 'Must format end date as next day');
  assert.ok(ics.includes('SUMMARY:Sharma-Verma Wedding: Send invitations\\, book caterer\\; confirm Haldi & Mehendi'), 'Special characters must be properly escaped');
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'), 'Must end with END:VCALENDAR');
});
