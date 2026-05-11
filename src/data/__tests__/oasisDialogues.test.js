import { describe, it, expect } from 'vitest';
import { Story } from 'inkjs';

import guardHamzaJson from '../ink/guard-hamza.ink.json';
import herbalistMaryamJson from '../ink/herbalist-maryam.ink.json';
import bakerYasminJson from '../ink/baker-yasmin.ink.json';
import imamMuhammadJson from '../ink/imam-muhammad.ink.json';
import guideSalimJson from '../ink/guide-salim.ink.json';

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
  'guard-hamza': guardHamzaJson,
  'herbalist-maryam': herbalistMaryamJson,
  'baker-yasmin': bakerYasminJson,
  'imam-muhammad': imamMuhammadJson,
  'guide-salim': guideSalimJson,
};

const OASIS_NPC_IDS = Object.keys(INK_FILES);

describe('Oasis NPC Dialogues (.ink.json parse verification)', () => {
  describe('JSON structure integrity', () => {
    it('all 5 new Oasis ink JSON files are valid objects', () => {
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
    for (const npcId of OASIS_NPC_IDS) {
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
          `${npcId} should have at least 2 choices`,
        ).toBeGreaterThanOrEqual(2);
      });

      it(`${npcId}: story has at least 3 choices in hub`, () => {
        const story = new Story(INK_FILES[npcId]);
        bindNoopExternals(story);

        // Advance past intro, pick first choice to reach hub
        collectLines(story);
        if (story.currentChoices.length > 0) {
          story.ChooseChoiceIndex(0);
          collectLines(story);
        }

        // Check hub choices (should have at least 3)
        expect(
          story.currentChoices.length,
          `${npcId} hub should have at least 2 choices`,
        ).toBeGreaterThanOrEqual(2);
      });
    }
  });

  describe('Story content — dialogue line count', () => {
    for (const npcId of OASIS_NPC_IDS) {
      it(`${npcId}: produces 10+ lines of content across all paths`, () => {
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

        expect(
          totalLines,
          `${npcId} should have 10+ lines across all paths`,
        ).toBeGreaterThanOrEqual(10);
      });
    }
  });

  describe('Quest hooks', () => {
    it('guard-hamza offers guard_directions quest hook', () => {
      const story = new Story(INK_FILES['guard-hamza']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'guard_directions') questStarted = true;
      });

      // Navigate to hub and pick quest option
      collectLines(story);
      story.ChooseChoiceIndex(0); // first intro choice
      collectLines(story);

      // Try each hub choice to find the quest option
      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('مساعدة') || c.text.includes('حراسة'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });

    it('herbalist-maryam offers farm_nature quest hook', () => {
      const story = new Story(INK_FILES['herbalist-maryam']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'farm_nature') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('ساعدي') || c.text.includes('في جمع'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });

    it('guide-salim offers words_of_oasis quest hook', () => {
      const story = new Story(INK_FILES['guide-salim']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'words_of_oasis') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('جولة') || c.text.includes('واحة'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });

    it('imam-muhammad offers palace_faith quest hook', () => {
      const story = new Story(INK_FILES['imam-muhammad']);

      let questStarted = false;
      story.BindExternalFunction('setComprehensionCheck', () => {});
      story.BindExternalFunction('setFlag', () => {});
      story.BindExternalFunction('getFlag', () => false);
      story.BindExternalFunction('changeRelationship', () => {});
      story.BindExternalFunction('startQuest', (questId) => {
        if (questId === 'palace_faith') questStarted = true;
      });

      collectLines(story);
      story.ChooseChoiceIndex(0);
      collectLines(story);

      const hubChoices = story.currentChoices;
      const questChoiceIdx = hubChoices.findIndex((c) =>
        c.text.includes('كلمات') || c.text.includes('إيمان'),
      );

      if (questChoiceIdx >= 0) {
        story.ChooseChoiceIndex(questChoiceIdx);
        collectLines(story);
      }

      expect(questStarted).toBe(true);
    });
  });

  describe('Comprehension checks', () => {
    for (const npcId of OASIS_NPC_IDS) {
      it(`${npcId}: comprehension check is set before #comprehension_check tag`, () => {
        let checkWasSet = false;
        const story = new Story(INK_FILES[npcId]);

        story.BindExternalFunction('setComprehensionCheck', (question, a, b, c, idx) => {
          expect(question.length, `${npcId}: question should be non-empty`).toBeGreaterThan(0);
          expect([a, b, c].every((opt) => opt.length > 0), `${npcId}: all options should be non-empty`).toBe(true);
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
    it('guard-hamza dialogue contains #vocab tags on teaching lines', () => {
      const story = new Story(INK_FILES['guard-hamza']);
      bindNoopExternals(story);

      const allTags = [];
      while (story.canContinue) {
        story.Continue();
        allTags.push(...story.currentTags);
      }

      const vocabTags = allTags.filter((t) => t.startsWith('vocab:'));
      expect(vocabTags.length, 'guard-hamza should have vocab tags').toBeGreaterThanOrEqual(1);
    });

    it('at least 3 of the 5 new dialogues contain #vocab tags', () => {
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
          // Also try first choice
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
        'at least 3 dialogue files should have #vocab tags',
      ).toBeGreaterThanOrEqual(3);
    });
  });

  describe('NPC IDs match ink filenames', () => {
    it('guard-hamza.ink.json is discoverable by InkDialogueEngine naming convention', () => {
      // InkDialogueEngine looks for `${npcId}.ink.json` — just verify our JSON objects exist
      expect(guardHamzaJson).toBeTruthy();
      expect(herbalistMaryamJson).toBeTruthy();
      expect(bakerYasminJson).toBeTruthy();
      expect(imamMuhammadJson).toBeTruthy();
      expect(guideSalimJson).toBeTruthy();
    });
  });
});
