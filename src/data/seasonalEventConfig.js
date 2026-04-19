/**
 * seasonalEventConfig.js — Configuration for all 5 seasonal events
 *
 * Used by seasonalAutomationMiddleware to auto-activate/deactivate events
 * based on the current date.
 *
 * Date descriptor formats:
 *   - Hijri:     { calendar: 'hijri',     month: M, day: D }
 *   - Gregorian: { calendar: 'gregorian', month: M, day: D }
 *
 * All Hijri events are within a single Hijri month (startDate.month === endDate.month).
 * Events are checked in order — first match wins.
 */

export const SEASONAL_EVENT_CONFIGS = {
  /**
   * Eid al-Fitr — Shawwal 1-3 (follows Ramadan).
   * Checked before Ramadan to handle the month-9/10 boundary correctly.
   */
  eid_fitr: {
    id: 'eid_fitr',
    name: 'Eid al-Fitr',
    nameArabic: 'عيد الفطر',
    startDate: { calendar: 'hijri', month: 10, day: 1 },
    endDate: { calendar: 'hijri', month: 10, day: 3 },
    bonuses: {
      xpMultiplier: 1.5,
      specialShopItems: ['eid_sweets', 'eid_outfit', 'celebration_hat'],
    },
  },

  /**
   * Eid al-Adha — Dhul Hijjah 10-13.
   */
  eid_adha: {
    id: 'eid_adha',
    name: 'Eid al-Adha',
    nameArabic: 'عيد الأضحى',
    startDate: { calendar: 'hijri', month: 12, day: 10 },
    endDate: { calendar: 'hijri', month: 12, day: 13 },
    bonuses: {
      xpMultiplier: 1.5,
      specialShopItems: ['hajj_scroll', 'sacrifice_token', 'pilgrim_staff'],
    },
  },

  /**
   * Ramadan — entire month of Ramadan (Hijri month 9).
   */
  ramadan: {
    id: 'ramadan',
    name: 'Ramadan',
    nameArabic: 'رمضان',
    startDate: { calendar: 'hijri', month: 9, day: 1 },
    endDate: { calendar: 'hijri', month: 9, day: 30 },
    bonuses: {
      xpMultiplier: 1.25,
      specialShopItems: ['ramadan_dates', 'prayer_mat', 'lantern_ramadan'],
    },
  },

  /**
   * Islamic New Year — 1 Muharram (first 3 days).
   */
  islamic_new_year: {
    id: 'islamic_new_year',
    name: 'Islamic New Year',
    nameArabic: 'رأس السنة الهجرية',
    startDate: { calendar: 'hijri', month: 1, day: 1 },
    endDate: { calendar: 'hijri', month: 1, day: 3 },
    bonuses: {
      xpMultiplier: 1.2,
      specialShopItems: ['new_year_scroll', 'moon_charm'],
    },
  },

  /**
   * Arabic Language Day — December 18 (UN observance, Gregorian).
   */
  arabic_language_day: {
    id: 'arabic_language_day',
    name: 'Arabic Language Day',
    nameArabic: 'يوم اللغة العربية',
    startDate: { calendar: 'gregorian', month: 12, day: 18 },
    endDate: { calendar: 'gregorian', month: 12, day: 18 },
    bonuses: {
      xpMultiplier: 1.3,
      specialShopItems: ['calligraphy_pen', 'language_tome', 'arabic_quill'],
    },
  },
};
