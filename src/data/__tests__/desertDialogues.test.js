import { describe, it, expect } from 'vitest';
import { Story } from 'inkjs';

import traderHassanJson from '../ink/trader-hassan.ink.json';
import wandererAliJson from '../ink/wanderer-ali.ink.json';
import weaverZahraJson from '../ink/weaver-zahra.ink.json';
import carpetSellerJamalJson from '../ink/carpet-seller-jamal.ink.json';
import poetDesertJson from '../ink/poet-desert.ink.json';

/**
 * Bind all EXTERNAL functions as no-ops so the story can continue without errors.
 */
function bindNoopExternals(story) {
  const noops = [
    'setComprehensionCheck',
    'setFlag',
    'getFlag',
    'changeRelationship',
    'startQuest',
    'getLearningPath',
    'getGossipToken',
    'markGossipHeard',
    'getGossipGrammarNote',
    'addFsrsCardFromInk',
    'getVocabMastery',
  ];

  for (const fn of noops) {
    try {
      story.BindExternalFunction(fn, () => false);
    } catch {
      // Not declared in this story — skip
    }
  }
}

/**
 * Advance a story and collect all text lines until END or a choice.
 */
function collectLines(story) {
  const lines = [];
  while (story.canContinue) {
    lines.push(story.Continue().trim());
  }
  return lines.filter(Boolean);
}

const INK_FILES = {
  'trader-hassan': traderHassanJson,
  'wanderer-ali': wandererAliJson,
  'weaver-zahra': weaverZahraJson,
  'carpet-seller-jamal': carpetSellerJamalJson,
  'poet-desert': poetDesertJson,
};

const DESERT_NPC_IDS = Object.keys(INK_FILES);

describe('Desert NPC Dialogues (.ink.json parse verification)', () => {
  describe('JSON structure integrity', () => {
    it('all 5 new Desert ink JSON files are valid objects', () => {
      for (const [npcId, json] of Object.entries(INK_FILES)) {
        expect(json, `${npcId} should be a valid JSON object`).toBeTruthy();
        expect(typeof json, `${npcId} should be an object`).toBe('object');
      }
    });

    it('all 5 files contain inkVersion field', () => {
      for (const [npcId, json] of Object.entries(INK_FILES)) {
        expect(json, `${npcId} should have inkVersion`).toHaveProperty('inkVersion');
        expect(typeof json.inkVersion, `${npcId}.inkVersion should be a number`).toBe('number');
      }
    });

    it('all 5 files contain root field', () => {
      for (const [npcId, json] of Object.entries(INK_FILES)) {
        expect(json, `${npcId} should have root field`).toHaveProperty('root');
      }
    });
  });

  describe('Story instantiation', () => {
    it('all 5 stories can be instantiated by inkjs without errors', () => {
      for (const [npcId, json] of Object.entries(INK_FILES)) {
        expect(
          () => {
            const story = new Story(json);
            bindNoopExternals(story);
          },
          `${npcId} should instantiate without throwing`,
        ).not.toThrow();
      }
    });
  });

  describe('Story content — first meeting', () => {
    for (const npcId of DESERT_NPC_IDS) {
      it(`${npcId}: story canContinue at start`, () => {
        const story = new Story(INK_FILES[npcId]);
        bindNoopExternals(story);
        expect(story.canContinue).toBe(true);
      });

      it(`${npcId}: story produces Arabic dialogue lines`, () => {
        const story = new Story(INK_FILES[npcId]);
        bindNoopExternals(story);

        const lines = collectLines(story);
        const arabicRegex = /[\u0600-\u06FF]/;
        const arabicLines = lines.filter((l) => arabicRegex.test(l));
        expect(
          arabicLines.length,
          `${npcId} should have Arabic text in dialogue`,
        ).toBeGreaterThanOrEqual(1);
      });

      it(`${npcId}: story has choices (branching paths)`, () => {
        const story = new Story(INK_FILES[npcId]);
        bindNoopExternals(story);

        collectLines(story); // Advance to first choice point
        expect(
          story.currentChoices.length,
          `${npcId} should have at least 3 intro choices`,
        ).toBeGreaterThanOrEqual(3);
      });

      it(`${npcId}: story has hub choices after intro`, () => {
        const story = new Story(INK_FILES[npcId]);
        bindNoopExternals(story);

        // Advance past intro, pick first choice to reach hub
        collectLines(story);
        if (story.currentChoices.length > 0) {
          story.ChooseChoiceIndex(0);
          collectLines(story);
        }

        expect(
          story.currentChoices.length,
          `${npcId} hub should have at least 2 choices`,
        ).toBeGreaterThanOrEqual(2);
      });
    }
  });

  describe('Story content — dialogue line count (12+ required for Desert)', () => {
    for (const npcId of DESERT_NPC_IDS) {
      it(`${npcId}: produces 12+ lines of content across all paths`, () => {
        let totalLines = 0;

        // Path 1: first_meeting → first choice → hub → first hub choice
        const story1 = new Story(INK_FILES[npcId]);
        bindNoopExternals(story1);
        const introLines = collectLines(story1);
        totalLines += introLines.length;

        if (story1.currentChoices.length > 0) {
          story1.ChooseChoiceIndex(0);
          const path1Lines = collectLines(story1);
          totalLines += path1Lines.length;

          if (story1.currentChoices.length > 0) {
            story1.ChooseChoiceIndex(0);
            const hubLines = collectLines(story1);
            totalLines += hubLines.length;
          }
        }

        // Path 2: second intro choice
        const story2 = new Story(INK_FILES[npcId]);
        bindNoopExternals(story2);
        collectLines(story2);
        if (story2.currentChoices.length > 1) {
          story2.ChooseChoiceIndex(1);
          const path2Lines = collectLines(story2);
          totalLines += path2Lines.length;
        }

        // Path 3: third intro choice
        const story3 = new Story(INK_FILES[npcId]);
        bindNoopExternals(story3);
        collectLines(story3);
        if (story3.currentChoices.length > 2) {
          story3.ChooseChoiceIndex(2);
          const path3Lines = collectLines(story3);
          totalLines += path3Lines.length;
        }

        expect(
          totalLines,
          `${npcId} should have 12+ lines across all paths`,
        ).toBeGreaterThanOrEqual(12);
      });
    }
  });

  describe('Quest hooks', () => {
    it('trader-hassan offers silk_road_investigation quest hook', () => {
      const story = new Story(INK_FILES['trader-hassan']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'silk_road_investigation') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('مساعدة') || c.text.includes('قوافل'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });

    it('wanderer-ali offers desert_paths quest hook', () => {
      const story = new Story(INK_FILES['wanderer-ali']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'desert_paths') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('طرق') || c.text.includes('سرية'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });

    it('weaver-zahra offers artisan_patterns quest hook', () => {
      const story = new Story(INK_FILES['weaver-zahra']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'artisan_patterns') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('أنماط') || c.text.includes('مساعدتك'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });

    it('poet-desert offers ancient_verses quest hook', () => {
      const story = new Story(INK_FILES['poet-desert']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'ancient_verses') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('أشعار') || c.text.includes('البحث'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });
  });

  describe('Faction reputation choices', () => {
    it('trader-hassan offers merchants guild faction choice', () => {
      const story = new Story(INK_FILES['trader-hassan']);

      let merchantsFlagSet = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', (key) => {
        if (key === 'merchants_guild_supported') merchantsFlagSet = true;
      });
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', () => {});

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const factionChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('نقابة') || c.text.includes('الانضمام'),
      );

      if (factionChoiceIdx >= 0) {
        story.ChooseChoiceIndex(factionChoiceIdx);
        collectLines(story);
      }

      expect(merchantsFlagSet).toBe(true);
    });

    it('carpet-seller-jamal offers merchants guild faction choice', () => {
      const story = new Story(INK_FILES['carpet-seller-jamal']);

      let merchantsFlagSet = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', (key) => {
        if (key === 'merchants_guild_supported') merchantsFlagSet = true;
      });
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', () => {});

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const factionChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('نقابة') || c.text.includes('تنصحني'),
      );

      if (factionChoiceIdx >= 0) {
        story.ChooseChoiceIndex(factionChoiceIdx);
        collectLines(story);
      }

      expect(merchantsFlagSet).toBe(true);
    });
  });

  describe('Comprehension checks', () => {
    for (const npcId of DESERT_NPC_IDS) {
      it(`${npcId}: comprehension check is set before #comprehension_check tag`, () => {
        let checkWasSet = false;
        const story = new Story(INK_FILES[npcId]);

        story.BindExternalFunction('setComprehensionCheck', (question, a, b, c, idx) => {
          expect(question.length, `${npcId}: question should be non-empty`).toBeGreaterThan(0);
          expect([a, b, c].every((opt) => opt.length > 0), `${npcId}: all options should be non-empty`).toBe(
            true,
          );
          expect(idx).toBeGreaterThanOrEqual(0);
          expect(idx).toBeLessThanOrEqual(2);
          checkWasSet = true;
        });
        story.BindExternalFunction('setFlag', () => {});
        story.BindExternalFunction('getFlag', () => false);
        story.BindExternalFunction('changeRelationship', () => {});
        try {
          story.BindExternalFunction('startQuest', () => {});
        } catch { /* not declared */ }

        // Navigate: intro → first choice → hub → comprehension choice
        collectLines(story);
        story.ChooseChoiceIndex(0);
        collectLines(story);

        // The first hub choice should be the comprehension check
        if (story.currentChoices.length > 0) {
          story.ChooseChoiceIndex(0);
          collectLines(story);
        }

        expect(checkWasSet, `${npcId}: setComprehensionCheck should have been called`).toBe(true);
      });
    }
  });

  describe('Vocabulary tags', () => {
    it('all 5 Desert dialogues contain #vocab tags on teaching lines', () => {
      let filesWithVocabTags = 0;

      for (const [_npcId, json] of Object.entries(INK_FILES)) {
        const story = new Story(json);
        bindNoopExternals(story);

        const allTags = [];
        try {
          while (story.canContinue) {
            story.Continue();
            allTags.push(...story.currentTags);
          }
          // Try first intro choice path
          if (story.currentChoices.length > 0) {
            story.ChooseChoiceIndex(0);
            while (story.canContinue) {
              story.Continue();
              allTags.push(...story.currentTags);
            }
          }
        } catch { /* story ended */ }

        const vocabTags = allTags.filter((t) => t.startsWith('vocab:'));
        if (vocabTags.length > 0) filesWithVocabTags++;
      }

      expect(
        filesWithVocabTags,
        'all 5 Desert dialogue files should have #vocab tags',
      ).toBeGreaterThanOrEqual(5);
    });

    it('poet-desert dialogue contains Arabic literary vocabulary tags', () => {
      const story = new Story(INK_FILES['poet-desert']);
      bindNoopExternals(story);

      const allTags = [];
      while (story.canContinue) {
        story.Continue();
        allTags.push(...story.currentTags);
      }

      const vocabTags = allTags.filter((t) => t.startsWith('vocab:'));
      expect(vocabTags.length, 'poet-desert should have vocab tags').toBeGreaterThanOrEqual(1);
    });
  });

  describe('Arabic language level (A2-B1)', () => {
    it('each Desert NPC dialogue contains multi-clause Arabic sentences', () => {
      for (const [npcId, json] of Object.entries(INK_FILES)) {
        const story = new Story(json);
        bindNoopExternals(story);

        const allLines = [];
        collectLines(story).forEach((l) => allLines.push(l));
        if (story.currentChoices.length > 0) {
          story.ChooseChoiceIndex(0);
          collectLines(story).forEach((l) => allLines.push(l));
        }

        const arabicRegex = /[\u0600-\u06FF]/;
        const arabicLines = allLines.filter((l) => arabicRegex.test(l));

        // A2-B1 check: at least some lines should be longer (more complex sentences)
        const complexLines = arabicLines.filter((l) => l.length > 30);
        expect(
          complexLines.length,
          `${npcId} should have complex Arabic sentences (A2-B1 level)`,
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('NPC IDs match ink filenames', () => {
    it('all 5 Desert ink.json files are discoverable by InkDialogueEngine naming convention', () => {
      expect(traderHassanJson).toBeTruthy();
      expect(wandererAliJson).toBeTruthy();
      expect(weaverZahraJson).toBeTruthy();
      expect(carpetSellerJamalJson).toBeTruthy();
      expect(poetDesertJson).toBeTruthy();
    });
  });
});
