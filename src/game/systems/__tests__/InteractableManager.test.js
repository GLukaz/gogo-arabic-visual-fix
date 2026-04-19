import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import { InteractableManager } from '../InteractableManager.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

// Mock dependencies
vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

vi.mock('../../../store/store.js', () => ({
  store: {
    getState: vi.fn(() => ({
      player: {
        openedChests: [],
        readBooks: []
      },
      settings: {
        showDiacritics: true
      }
    })),
    dispatch: vi.fn()
  }
}));

vi.mock('../../../utils/arabicUtils.js', () => ({
  stripDiacritics: vi.fn((text) => text.replace(/[\u064B-\u065F]/g, ''))
}));

describe('InteractableManager', () => {
  let scene;
  let interactableManager;
  let mockPlayerSprite;
  let interactKey;
  let setInteractCooldown;

  beforeEach(() => {
    scene = createMockScene();
    interactableManager = new InteractableManager(scene);

    mockPlayerSprite = {
      x: 320,
      y: 320
    };

    interactKey = { isDown: false };
    setInteractCooldown = vi.fn();

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create()', () => {
    it('should create interactable objects from config', () => {
      const objectSprites = [];
      const configs = [
        { id: 'sign1', type: 'sign', x: 5, y: 5, textArabic: 'مرحبا', textEnglish: 'Welcome' },
        { id: 'chest1', type: 'chest', x: 10, y: 10, minDirhams: 10, maxDirhams: 50 }
      ];

      interactableManager.create(configs, objectSprites);

      expect(interactableManager.interactables).toHaveLength(2);
      expect(objectSprites.length).toBeGreaterThan(0); // Sprites were added
    });

    it('should use correct sprite keys for each type', () => {
      const objectSprites = [];
      const configs = [
        { id: 'sign1', type: 'sign', x: 5, y: 5, textArabic: 'مرحبا', textEnglish: 'Welcome' },
        { id: 'book1', type: 'bookshelf', x: 7, y: 7, category: 'grammar' },
        { id: 'chest1', type: 'chest', x: 10, y: 10, minDirhams: 10, maxDirhams: 50 }
      ];

      interactableManager.create(configs, objectSprites);

      // Verify sprites created with correct keys (Kenmi)
      expect(scene.add.image).toHaveBeenCalledWith(352, 352, 'kenmi-desert-temple-desert-obelisk-small-2');
      expect(scene.add.image).toHaveBeenCalledWith(480, 480, 'kenmi-desert-temple-desert-obelisk-small-1');
      expect(scene.add.image).toHaveBeenCalledWith(672, 672, 'kenmi-desert-props-desert-rocks');
    });

    it('should tint already-opened chests from Redux state', async () => {
      const { store } = await import('../../../store/store.js');
      store.getState.mockReturnValue({
        player: {
          openedChests: ['chest1'],
          readBooks: []
        },
        settings: { showDiacritics: true }
      });

      const objectSprites = [];
      const configs = [
        { id: 'chest1', type: 'chest', x: 10, y: 10, minDirhams: 10, maxDirhams: 50 }
      ];

      interactableManager.create(configs, objectSprites);

      // Chest should be tinted gray
      const chest = interactableManager.interactables[0];
      expect(chest.sprite.setTint).toHaveBeenCalledWith(0x666666);
    });

    it('should create interaction hints starting hidden', () => {
      const objectSprites = [];
      const configs = [
        { id: 'sign1', type: 'sign', x: 5, y: 5, textArabic: 'مرحبا', textEnglish: 'Welcome' }
      ];

      interactableManager.create(configs, objectSprites);

      const sign = interactableManager.interactables[0];
      expect(sign.hintText.setVisible).toHaveBeenCalledWith(false);
    });

    it('should respect harakat setting for sign labels', async () => {
      const { store } = await import('../../../store/store.js');
      const { stripDiacritics } = await import('../../../utils/arabicUtils.js');

      store.getState.mockReturnValue({
        player: { openedChests: [], readBooks: [] },
        settings: { showDiacritics: false }
      });

      const objectSprites = [];
      const configs = [
        { id: 'sign1', type: 'sign', x: 5, y: 5, textArabic: 'مَرْحَبًا', textEnglish: 'Welcome' }
      ];

      interactableManager.create(configs, objectSprites);

      expect(stripDiacritics).toHaveBeenCalledWith('مَرْحَبًا');
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      const configs = [
        { id: 'sign1', type: 'sign', x: 5, y: 5, textArabic: 'مرحبا', textEnglish: 'Welcome' }
      ];
      interactableManager.create(configs, []);
    });

    it('should show hint when player is in range', async () => {
      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64); // Within range

      interactableManager.update(mockPlayerSprite, interactKey, false, setInteractCooldown);

      expect(interactableManager.interactables[0].hintText.setVisible).toHaveBeenCalledWith(true);
    });

    it('should hide hint when player is out of range', async () => {
      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(200); // Beyond range

      interactableManager.update(mockPlayerSprite, interactKey, false, setInteractCooldown);

      expect(interactableManager.interactables[0].hintText.setVisible).toHaveBeenCalledWith(false);
    });

    it('should trigger interaction on SPACE press when in range', async () => {
      const Phaser = await import('phaser');
      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64);
      vi.spyOn(Phaser.default.Input.Keyboard, 'JustDown').mockReturnValue(true);

      interactableManager.update(mockPlayerSprite, interactKey, false, setInteractCooldown);

      expect(setInteractCooldown).toHaveBeenCalledWith(true);
      expect(scene.time.delayedCall).toHaveBeenCalledWith(500, expect.any(Function));
    });

    it('should not trigger interaction when on cooldown', async () => {
      const Phaser = await import('phaser');
      const { EventBus } = await import('../../../utils/eventBus.js');

      vi.spyOn(Phaser.default.Math.Distance, 'Between').mockReturnValue(64);
      vi.spyOn(Phaser.default.Input.Keyboard, 'JustDown').mockReturnValue(true);

      interactableManager.update(mockPlayerSprite, interactKey, true, setInteractCooldown);

      expect(EventBus.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleInteractable()', () => {
    it('should emit show-sign event for sign interaction', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');

      const sign = {
        type: 'sign',
        textArabic: 'مرحبا',
        textEnglish: 'Welcome'
      };

      interactableManager.handleInteractable(sign);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.SIGN_SHOW, {
        arabic: 'مرحبا',
        english: 'Welcome'
      });
      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.PLAYER_FREEZE);
    });

    it('should emit bookshelf-interact event for unread bookshelf', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');
      const { store } = await import('../../../store/store.js');

      store.getState.mockReturnValue({
        player: { openedChests: [], readBooks: [] },
        settings: { showDiacritics: true }
      });

      const bookshelf = {
        type: 'bookshelf',
        id: 'book1',
        category: 'grammar'
      };

      interactableManager.handleInteractable(bookshelf);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.BOOKSHELF_INTERACT, {
        category: 'grammar',
        id: 'book1'
      });
    });

    it('should emit bookshelf-interact with reread flag for already-read bookshelf', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');
      const { store } = await import('../../../store/store.js');

      store.getState.mockReturnValue({
        player: { openedChests: [], readBooks: ['book1'] },
        settings: { showDiacritics: true }
      });

      const bookshelf = {
        type: 'bookshelf',
        id: 'book1',
        category: 'grammar'
      };

      interactableManager.handleInteractable(bookshelf);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.BOOKSHELF_INTERACT, {
        category: 'grammar',
        id: 'book1',
        reread: true
      });
    });

    it('should emit chest-opened event for unopened chest with random amount', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');
      const { store } = await import('../../../store/store.js');

      store.getState.mockReturnValue({
        player: { openedChests: [], readBooks: [] },
        settings: { showDiacritics: true }
      });

      const chest = {
        type: 'chest',
        id: 'chest1',
        minDirhams: 10,
        maxDirhams: 50,
        sprite: {
          setTint: vi.fn()
        }
      };

      interactableManager.handleInteractable(chest);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.CHEST_OPENED, {
        amount: expect.any(Number),
        id: 'chest1'
      });

      // Verify amount is within range
      const emitCall = EventBus.emit.mock.calls.find(call => call[0] === EVENTS.CHEST_OPENED);
      const amount = emitCall[1].amount;
      expect(amount).toBeGreaterThanOrEqual(10);
      expect(amount).toBeLessThanOrEqual(50);

      // Chest should be tinted
      expect(chest.sprite.setTint).toHaveBeenCalledWith(0x666666);
    });

    it('should emit chest-empty event for already-opened chest', async () => {
      const { EventBus } = await import('../../../utils/eventBus.js');
      const { store } = await import('../../../store/store.js');

      store.getState.mockReturnValue({
        player: { openedChests: ['chest1'], readBooks: [] },
        settings: { showDiacritics: true }
      });

      const chest = {
        type: 'chest',
        id: 'chest1',
        minDirhams: 10,
        maxDirhams: 50
      };

      interactableManager.handleInteractable(chest);

      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.CHEST_EMPTY, {
        id: 'chest1'
      });
    });
  });

  describe('destroy()', () => {
    it('should destroy all interactables and clear array', () => {
      const configs = [
        { id: 'sign1', type: 'sign', x: 5, y: 5, textArabic: 'مرحبا', textEnglish: 'Welcome' },
        { id: 'chest1', type: 'chest', x: 10, y: 10, minDirhams: 10, maxDirhams: 50 }
      ];
      interactableManager.create(configs, []);

      interactableManager.destroy();

      expect(interactableManager.interactables).toHaveLength(0);
    });
  });
});
