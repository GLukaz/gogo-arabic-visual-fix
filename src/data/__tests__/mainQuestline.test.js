import { describe, it, expect } from 'vitest';
import {
  MAIN_QUESTLINE,
  CHAPTER_META,
  MAIN_QUEST_COUNT,
  getQuestsByChapter,
  getMainQuestById,
  getAllMainQuestVocabulary,
  validatePrerequisiteChain,
} from '../mainQuestline.js';

describe('mainQuestline data integrity', () => {
  it('has exactly 20 quests', () => {
    expect(MAIN_QUESTLINE).toHaveLength(20);
    expect(MAIN_QUEST_COUNT).toBe(20);
  });

  it('has exactly 5 chapters', () => {
    expect(CHAPTER_META).toHaveLength(5);
  });

  it('all quest IDs are unique', () => {
    const ids = MAIN_QUESTLINE.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all quest IDs follow the main_N pattern', () => {
    for (const quest of MAIN_QUESTLINE) {
      expect(quest.id).toMatch(/^main_\d+$/);
    }
  });

  it('all quests have required fields', () => {
    const requiredFields = [
      'id',
      'chapter',
      'title',
      'titleArabic',
      'description',
      'zone',
      'npcGiver',
      'objectives',
      'dialogueIntro',
      'dialogueComplete',
      'reward',
      'prerequisites',
      'learningObjective',
      'vocabularyIntroduced',
    ];

    for (const quest of MAIN_QUESTLINE) {
      for (const field of requiredFields) {
        expect(quest[field], `${quest.id}: missing ${field}`).toBeDefined();
      }
    }
  });

  it('all quests have valid chapter numbers (1-5)', () => {
    for (const quest of MAIN_QUESTLINE) {
      expect(quest.chapter).toBeGreaterThanOrEqual(1);
      expect(quest.chapter).toBeLessThanOrEqual(5);
    }
  });

  it('each chapter has exactly 4 quests', () => {
    for (let ch = 1; ch <= 5; ch++) {
      const chapterQuests = getQuestsByChapter(ch);
      expect(chapterQuests, `Chapter ${ch} does not have 4 quests`).toHaveLength(4);
    }
  });

  it('all quests have Arabic text in titleArabic', () => {
    const arabicRegex = /[\u0600-\u06FF]/;
    for (const quest of MAIN_QUESTLINE) {
      expect(
        arabicRegex.test(quest.titleArabic),
        `${quest.id}: titleArabic has no Arabic characters`,
      ).toBe(true);
    }
  });

  it('all dialogue intro/complete have arabic and english', () => {
    for (const quest of MAIN_QUESTLINE) {
      expect(quest.dialogueIntro.arabic, `${quest.id}: dialogueIntro missing arabic`).toBeTruthy();
      expect(quest.dialogueIntro.english, `${quest.id}: dialogueIntro missing english`).toBeTruthy();
      expect(quest.dialogueComplete.arabic, `${quest.id}: dialogueComplete missing arabic`).toBeTruthy();
      expect(quest.dialogueComplete.english, `${quest.id}: dialogueComplete missing english`).toBeTruthy();
    }
  });

  it('all objectives have id, description, descriptionArabic, and type', () => {
    const validTypes = ['talk', 'learn', 'explore', 'collect', 'battle'];
    for (const quest of MAIN_QUESTLINE) {
      expect(quest.objectives.length, `${quest.id}: no objectives`).toBeGreaterThanOrEqual(1);
      for (const obj of quest.objectives) {
        expect(obj.id, `${quest.id}: objective missing id`).toBeTruthy();
        expect(obj.description, `${quest.id}: objective missing description`).toBeTruthy();
        expect(obj.descriptionArabic, `${quest.id}: objective missing descriptionArabic`).toBeTruthy();
        expect(obj.type, `${quest.id}: objective missing type`).toBeTruthy();
        expect(validTypes, `${quest.id}: invalid objective type ${obj.type}`).toContain(obj.type);
      }
    }
  });

  it('all rewards have xp and dirhams', () => {
    for (const quest of MAIN_QUESTLINE) {
      expect(typeof quest.reward.xp, `${quest.id}: reward.xp not number`).toBe('number');
      expect(typeof quest.reward.dirhams, `${quest.id}: reward.dirhams not number`).toBe('number');
      expect(quest.reward.xp, `${quest.id}: reward.xp should be positive`).toBeGreaterThan(0);
      expect(quest.reward.dirhams, `${quest.id}: reward.dirhams should be positive`).toBeGreaterThan(0);
    }
  });

  it('all prerequisite references are valid quest IDs', () => {
    expect(validatePrerequisiteChain()).toBe(true);
  });

  it('first quest has no prerequisites', () => {
    expect(MAIN_QUESTLINE[0].prerequisites).toHaveLength(0);
  });

  it('prerequisite chain is sequential (no circular dependencies)', () => {
    const questIndex = {};
    MAIN_QUESTLINE.forEach((q, i) => { questIndex[q.id] = i; });

    for (const quest of MAIN_QUESTLINE) {
      for (const prereq of quest.prerequisites) {
        expect(
          questIndex[prereq],
          `${quest.id}: prerequisite ${prereq} comes after this quest`,
        ).toBeLessThan(questIndex[quest.id]);
      }
    }
  });

  it('all quests introduce 3-5 vocabulary words', () => {
    for (const quest of MAIN_QUESTLINE) {
      expect(
        quest.vocabularyIntroduced.length,
        `${quest.id}: has ${quest.vocabularyIntroduced.length} vocab words`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        quest.vocabularyIntroduced.length,
        `${quest.id}: has ${quest.vocabularyIntroduced.length} vocab words`,
      ).toBeLessThanOrEqual(5);
    }
  });

  it('vocabulary introduced across all quests is non-empty', () => {
    const allVocab = getAllMainQuestVocabulary();
    expect(allVocab.length).toBeGreaterThanOrEqual(60);
  });

  it('all zones from CHAPTER_META are valid', () => {
    const validZones = [
      'oasis-village', 'ancient-library', 'desert-marketplace',
      'bedouin-camp', 'royal-palace', 'mountain-pass',
      'coastal-port', 'hidden-oasis',
    ];

    for (const chapter of CHAPTER_META) {
      for (const zone of chapter.zones) {
        expect(validZones, `Invalid zone in chapter ${chapter.chapter}: ${zone}`).toContain(zone);
      }
    }
  });

  it('quest zones match their chapter zones', () => {
    for (const quest of MAIN_QUESTLINE) {
      const chapterMeta = CHAPTER_META.find((c) => c.chapter === quest.chapter);
      expect(
        chapterMeta.zones,
        `${quest.id}: zone ${quest.zone} not in chapter ${quest.chapter} zones`,
      ).toContain(quest.zone);
    }
  });

  describe('helper functions', () => {
    it('getQuestsByChapter returns correct quests', () => {
      const ch1 = getQuestsByChapter(1);
      expect(ch1).toHaveLength(4);
      ch1.forEach((q) => expect(q.chapter).toBe(1));
    });

    it('getMainQuestById returns correct quest', () => {
      const quest = getMainQuestById('main_1');
      expect(quest).toBeDefined();
      expect(quest.title).toBe('Arrival at the Oasis');
    });

    it('getMainQuestById returns null for unknown ID', () => {
      expect(getMainQuestById('nonexistent')).toBeNull();
    });
  });
});
