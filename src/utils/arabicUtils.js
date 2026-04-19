// Strip diacritics from Arabic text
export function stripDiacritics(text) {
  // Remove Arabic diacritical marks (Unicode range 0x064B-0x0652, plus others)
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

// Check if text contains Arabic characters
export function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

// Compare two Arabic strings (diacritic-insensitive)
export function arabicEquals(a, b) {
  return stripDiacritics(a) === stripDiacritics(b);
}

// Format number in Arabic-Indic numerals
export function toArabicNumerals(num) {
  const arabicDigits = ['\u0660','\u0661','\u0662','\u0663','\u0664','\u0665','\u0666','\u0667','\u0668','\u0669'];
  return String(num).replace(/[0-9]/g, d => arabicDigits[parseInt(d)]);
}
