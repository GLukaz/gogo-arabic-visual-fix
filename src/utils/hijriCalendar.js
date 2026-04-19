/**
 * hijriCalendar.js — Hijri (Islamic) calendar utilities (Phase 86)
 *
 * Implements the tabular Islamic calendar (Type IIa, civil/Thursday epoch).
 * Accurate to +/-1 day of the observed calendar — sufficient for game events,
 * NOT suitable for religious observance.
 *
 * Algorithm:
 *   - Epoch: July 16, 622 CE (Julian) = 1 Muharram 1 AH
 *   - 30-year cycle: years 2,5,7,10,13,16,18,21,24,26,29 are leap (355 days)
 *   - Months alternate 30/29 days; month 12 gets 30 days in leap years
 *   - Julian Day Number (JDN) used as the intermediate representation
 */

// ── Constants ───────────────────────────────────────────────────────────────

/** Leap years within each 30-year Hijri cycle (IIa / civil) */
const LEAP_YEARS_IN_CYCLE = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

// Note: The integer-based Kuwaiti algorithm is used below for conversion.
// Therefore, the Hijri epoch (1948439.5 JDN) is implicitly handled in the 
// algorithmic offsets (e.g., 1948440) rather than a floating-point constant.

/** Month names in Arabic */
const HIJRI_MONTH_NAMES = [
  'مُحَرَّم',      // 1 — Muharram
  'صَفَر',         // 2 — Safar
  'رَبيع الأوَّل',  // 3 — Rabi al-Awwal
  'رَبيع الثاني',  // 4 — Rabi al-Thani
  'جُمادى الأولى', // 5 — Jumada al-Ula
  'جُمادى الآخِرة', // 6 — Jumada al-Akhira
  'رَجَب',         // 7 — Rajab
  'شَعبان',        // 8 — Sha'ban
  'رَمَضان',       // 9 — Ramadan
  'شَوَّال',       // 10 — Shawwal
  'ذو القَعدة',    // 11 — Dhul Qi'dah
  'ذو الحِجَّة',    // 12 — Dhul Hijjah
];

// ── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Check whether a Hijri year is a leap year (355 days instead of 354).
 * @param {number} year — Hijri year
 * @returns {boolean}
 */
function isHijriLeapYear(year) {
  return LEAP_YEARS_IN_CYCLE.includes(((year - 1) % 30) + 1);
}

/**
 * Convert a Gregorian date to a Julian Day Number.
 * Uses the proleptic Gregorian calendar formula.
 * @param {number} year
 * @param {number} month — 1-12
 * @param {number} day
 * @returns {number} Julian Day Number
 */
function gregorianToJDN(year, month, day) {
  // Adjust for Jan/Feb being months 13/14 of previous year
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Convert a Julian Day Number to a Hijri date.
 * @param {number} jdn — Julian Day Number
 * @returns {{ year: number, month: number, day: number }}
 */
function jdnToHijri(jdn) {
  const l = Math.floor(jdn) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remainder = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - remainder) / 5316) *
      Math.floor((50 * remainder) / 17719) +
    Math.floor(remainder / 5670) *
      Math.floor((43 * remainder) / 15238);
  const adjustedRemainder =
    remainder -
    Math.floor((30 - j) / 15) *
      Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) *
      Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * adjustedRemainder) / 709);
  const day = adjustedRemainder - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day };
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Convert a Gregorian Date to a Hijri date.
 * @param {Date} date — JavaScript Date object
 * @returns {{ year: number, month: number, day: number }}
 */
export function gregorianToHijri(date) {
  const jdn = gregorianToJDN(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return jdnToHijri(jdn);
}

/**
 * Check if a date falls during Ramadan (Hijri month 9).
 * @param {Date} date
 * @returns {boolean}
 */
export function isRamadan(date) {
  const hijri = gregorianToHijri(date);
  return hijri.month === 9;
}

/**
 * Check if a date falls during Eid al-Fitr (Shawwal 1-3).
 * @param {Date} date
 * @returns {boolean}
 */
export function isEidAlFitr(date) {
  const hijri = gregorianToHijri(date);
  return hijri.month === 10 && hijri.day >= 1 && hijri.day <= 3;
}

/**
 * Check if a date falls during Eid al-Adha (Dhul Hijjah 10-13).
 * @param {Date} date
 * @returns {boolean}
 */
export function isEidAlAdha(date) {
  const hijri = gregorianToHijri(date);
  return hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13;
}

/**
 * Get the currently active Islamic event, if any.
 * @param {Date} date
 * @returns {'ramadan'|'eid_fitr'|'eid_adha'|null}
 */
export function getActiveIslamicEvent(date) {
  if (isEidAlFitr(date)) return 'eid_fitr';
  if (isEidAlAdha(date)) return 'eid_adha';
  if (isRamadan(date)) return 'ramadan';
  return null;
}

/**
 * Get the current day within Ramadan (1-30), or null if not Ramadan.
 * @param {Date} date
 * @returns {number|null}
 */
export function getDaysIntoRamadan(date) {
  const hijri = gregorianToHijri(date);
  if (hijri.month !== 9) return null;
  return hijri.day;
}

/**
 * Get the Arabic name of a Hijri month.
 * @param {number} month — 1-12
 * @returns {string} Arabic month name
 */
export function getHijriMonthName(month) {
  if (month < 1 || month > 12) return '';
  return HIJRI_MONTH_NAMES[month - 1];
}

/**
 * Get the Hijri year for a given Gregorian date.
 * @param {Date} date
 * @returns {number}
 */
export function getHijriYear(date) {
  return gregorianToHijri(date).year;
}

/**
 * Check if a Hijri year is a leap year.
 * @param {number} year
 * @returns {boolean}
 */
export { isHijriLeapYear };
