import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

/**
 * CalendarEvents — Fires themed events based on real-world dates.
 * Ramadan vocabulary, Eid celebrations, Friday market specials.
 */

const CALENDAR_EVENTS = [
  {
    id: 'ramadan',
    name: 'Ramadan',
    nameArabic: 'رمضان',
    startMonth: 2, startDay: 18,
    endMonth: 3, endDay: 19,
    vocabCategory: 'ramadan',
    specialGreeting: 'رمضان كريم',
  },
  {
    id: 'eid-al-fitr',
    name: 'Eid al-Fitr',
    nameArabic: 'عيد الفطر',
    startMonth: 3, startDay: 20,
    endMonth: 3, endDay: 22,
    vocabCategory: 'celebrations',
    specialGreeting: 'عيد مبارك',
  },
  {
    id: 'eid-al-adha',
    name: 'Eid al-Adha',
    nameArabic: 'عيد الأضحى',
    startMonth: 5, startDay: 26,
    endMonth: 5, endDay: 29,
    vocabCategory: 'celebrations',
    specialGreeting: 'عيد أضحى مبارك',
  },
  {
    id: 'friday-market',
    name: 'Friday Market',
    nameArabic: 'سوق الجمعة',
    dayOfWeek: 5,
    vocabCategory: 'trade',
    specialGreeting: 'جمعة مباركة',
  },
];

export class CalendarEvents {
  constructor() {
    this._lastCheck = null;
    this._activeEvents = [];
  }

  check() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (this._lastCheck === today) return this._activeEvents;
    this._lastCheck = today;

    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dayOfWeek = now.getDay();

    this._activeEvents = [];

    for (const event of CALENDAR_EVENTS) {
      let active = false;

      if (event.dayOfWeek !== undefined) {
        active = dayOfWeek === event.dayOfWeek;
      } else {
        const afterStart = month > event.startMonth || (month === event.startMonth && day >= event.startDay);
        const beforeEnd = month < event.endMonth || (month === event.endMonth && day <= event.endDay);
        active = afterStart && beforeEnd;
      }

      if (active) {
        this._activeEvents.push(event);
        EventBus.emit(EVENTS.CALENDAR_EVENT_ACTIVE, { event });
      }
    }

    return this._activeEvents;
  }

  getActiveEvents() {
    return this._activeEvents;
  }
}
