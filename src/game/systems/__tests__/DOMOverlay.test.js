import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockScene } from './mocks/sceneMock.js';
import DOMOverlayManager from '../DOMOverlay.js';

describe('DOMOverlay', () => {
  let scene;
  let domOverlay;
  let containerElement;

  beforeEach(() => {
    scene = createMockScene();

    // Mock DOM methods
    containerElement = {
      id: '',
      style: { cssText: '' },
      appendChild: vi.fn(),
      remove: vi.fn()
    };

    let isFirstDiv = true;

    global.document = {
      createElement: vi.fn((tag) => {
        if (tag === 'div' && isFirstDiv) {
          isFirstDiv = false;
          return containerElement;
        }
        return {
          id: '',
          innerHTML: '',
          style: { cssText: '', opacity: '1', left: '', top: '' },
          appendChild: vi.fn(),
          remove: vi.fn()
        };
      })
    };

    domOverlay = new DOMOverlayManager(scene);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('init()', () => {
    it('should create overlay container div', () => {
      domOverlay.init();

      expect(containerElement.id).toBe('dom-overlays');
      expect(containerElement.style.cssText).toContain('position:absolute');
      expect(scene.game.canvas.parentElement.appendChild).toHaveBeenCalledWith(containerElement);
    });

    it('should set container z-index to 10', () => {
      domOverlay.init();

      expect(containerElement.style.cssText).toContain('z-index:10');
    });

    it('should disable pointer events on container', () => {
      domOverlay.init();

      expect(containerElement.style.cssText).toContain('pointer-events:none');
    });
  });

  describe('createOverlay()', () => {
    beforeEach(() => {
      domOverlay.init();
    });

    it('should create overlay element with HTML content', () => {
      const id = domOverlay.createOverlay('test-1', 100, 200, '<span>Test</span>');

      expect(id).toBe('test-1');
      expect(domOverlay.overlays.has('test-1')).toBe(true);

      const overlay = domOverlay.overlays.get('test-1');
      expect(overlay.worldX).toBe(100);
      expect(overlay.worldY).toBe(200);
      expect(overlay.visible).toBe(true);
    });

    it('should apply custom styles from options', () => {
      domOverlay.createOverlay('test-2', 100, 200, '<span>Test</span>', {
        style: 'color: red; font-size: 16px;'
      });

      const overlay = domOverlay.overlays.get('test-2');
      expect(overlay.element.style.cssText).toContain('color: red');
    });

    it('should start hidden when visible:false in options', () => {
      domOverlay.createOverlay('test-3', 100, 200, '<span>Test</span>', {
        visible: false
      });

      const overlay = domOverlay.overlays.get('test-3');
      expect(overlay.visible).toBe(false);
      expect(overlay.element.style.opacity).toBe('0');
    });

    it('should apply offset coordinates from options', () => {
      domOverlay.createOverlay('test-4', 100, 200, '<span>Test</span>', {
        offsetX: 10,
        offsetY: -20
      });

      const overlay = domOverlay.overlays.get('test-4');
      expect(overlay.offsetX).toBe(10);
      expect(overlay.offsetY).toBe(-20);
    });
  });

  describe('createNpcLabel()', () => {
    beforeEach(() => {
      domOverlay.init();
    });

    it('should create bilingual NPC label', () => {
      const id = domOverlay.createNpcLabel('npc1', 320, 320, 'الشيخ', 'Elder');

      expect(id).toBe('npc-label-npc1');
      expect(domOverlay.overlays.has('npc-label-npc1')).toBe(true);

      const overlay = domOverlay.overlays.get('npc-label-npc1');
      expect(overlay.element.innerHTML).toContain('الشيخ');
      expect(overlay.element.innerHTML).toContain('Elder');
    });

    it('should apply correct Y offset for NPC labels', () => {
      domOverlay.createNpcLabel('npc1', 320, 320, 'الشيخ', 'Elder');

      const overlay = domOverlay.overlays.get('npc-label-npc1');
      expect(overlay.offsetY).toBe(-20);
    });

    it('should escape HTML in NPC names to prevent XSS', () => {
      domOverlay.createNpcLabel('npc1', 320, 320, '<script>alert("xss")</script>', 'Test');

      const overlay = domOverlay.overlays.get('npc-label-npc1');
      expect(overlay.element.innerHTML).not.toContain('<script>');
      expect(overlay.element.innerHTML).toContain('&lt;script&gt;');
    });

    it('should use Amiri font for Arabic text', () => {
      domOverlay.createNpcLabel('npc1', 320, 320, 'الشيخ', 'Elder');

      const overlay = domOverlay.overlays.get('npc-label-npc1');
      expect(overlay.element.innerHTML).toContain("font-family:'Amiri',serif");
    });

    it('should use Press Start 2P font for English text', () => {
      domOverlay.createNpcLabel('npc1', 320, 320, 'الشيخ', 'Elder');

      const overlay = domOverlay.overlays.get('npc-label-npc1');
      expect(overlay.element.innerHTML).toContain("font-family:'Press Start 2P',cursive");
    });
  });

  describe('createInteractionPrompt()', () => {
    beforeEach(() => {
      domOverlay.init();
    });

    it('should create SPACE prompt starting hidden', () => {
      const id = domOverlay.createInteractionPrompt('npc1', 320, 320);

      expect(id).toBe('prompt-npc1');

      const overlay = domOverlay.overlays.get('prompt-npc1');
      expect(overlay.visible).toBe(false);
      expect(overlay.element.innerHTML).toContain('SPACE');
    });

    it('should apply correct Y offset for prompts', () => {
      domOverlay.createInteractionPrompt('npc1', 320, 320);

      const overlay = domOverlay.overlays.get('prompt-npc1');
      expect(overlay.offsetY).toBe(-50);
    });
  });

  describe('setVisible()', () => {
    beforeEach(() => {
      domOverlay.init();
      domOverlay.createOverlay('test', 100, 200, '<span>Test</span>');
    });

    it('should show overlay when visible=true', () => {
      domOverlay.setVisible('test', true);

      const overlay = domOverlay.overlays.get('test');
      expect(overlay.visible).toBe(true);
      expect(overlay.element.style.opacity).toBe('1');
    });

    it('should hide overlay when visible=false', () => {
      domOverlay.setVisible('test', false);

      const overlay = domOverlay.overlays.get('test');
      expect(overlay.visible).toBe(false);
      expect(overlay.element.style.opacity).toBe('0');
    });

    it('should handle non-existent overlay gracefully', () => {
      expect(() => {
        domOverlay.setVisible('nonexistent', true);
      }).not.toThrow();
    });
  });

  describe('updateContent()', () => {
    beforeEach(() => {
      domOverlay.init();
      domOverlay.createOverlay('test', 100, 200, '<span>Original</span>');
    });

    it('should update overlay HTML content', () => {
      domOverlay.updateContent('test', '<span>Updated</span>');

      const overlay = domOverlay.overlays.get('test');
      expect(overlay.element.innerHTML).toBe('<span>Updated</span>');
    });

    it('should handle non-existent overlay gracefully', () => {
      expect(() => {
        domOverlay.updateContent('nonexistent', '<span>Test</span>');
      }).not.toThrow();
    });
  });

  describe('updatePosition()', () => {
    beforeEach(() => {
      domOverlay.init();
      domOverlay.createOverlay('test', 100, 200, '<span>Test</span>');
    });

    it('should update overlay world position', () => {
      domOverlay.updatePosition('test', 300, 400);

      const overlay = domOverlay.overlays.get('test');
      expect(overlay.worldX).toBe(300);
      expect(overlay.worldY).toBe(400);
    });

    it('should handle non-existent overlay gracefully', () => {
      expect(() => {
        domOverlay.updatePosition('nonexistent', 300, 400);
      }).not.toThrow();
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      domOverlay.init();
      domOverlay.createOverlay('test', 320, 240, '<span>Test</span>');
    });

    it('should update screen position when camera moves', () => {
      scene.cameras.main.scrollX = 0;
      scene.cameras.main.scrollY = 0;

      domOverlay.update();

      const overlay = domOverlay.overlays.get('test');
      expect(overlay.element.style.left).toBeDefined();
      expect(overlay.element.style.top).toBeDefined();
    });

    it('should not update when camera position unchanged (optimization)', () => {
      // First update sets lastCamera values
      domOverlay.update();

      const overlay = domOverlay.overlays.get('test');
      const initialLeft = overlay.element.style.left;

      // Second update with same camera should skip
      domOverlay.update();

      // Position should not be recalculated
      expect(overlay.element.style.left).toBe(initialLeft);
    });

    it('should account for camera scroll in position calculation', () => {
      scene.cameras.main.scrollX = 100;
      scene.cameras.main.scrollY = 50;
      scene.cameras.main.width = 1024;
      scene.cameras.main.height = 768;
      scene.game.canvas.width = 1024;
      scene.game.canvas.height = 768;

      domOverlay.update();

      const overlay = domOverlay.overlays.get('test');
      // (320 - 100) * 1 = 220
      expect(overlay.element.style.left).toBe('220px');
      // (240 - 50) * 1 = 190
      expect(overlay.element.style.top).toBe('190px');
    });

    it('should skip invisible overlays for performance', () => {
      domOverlay.setVisible('test', false);

      scene.cameras.main.scrollX = 100;
      domOverlay.update();

      // Position should not be updated for invisible overlays
      const overlay = domOverlay.overlays.get('test');
      expect(overlay.element.style.left).toBe('');
    });
  });

  describe('removeOverlay()', () => {
    beforeEach(() => {
      domOverlay.init();
      domOverlay.createOverlay('test', 100, 200, '<span>Test</span>');
    });

    it('should remove overlay from DOM and map', () => {
      domOverlay.removeOverlay('test');

      expect(domOverlay.overlays.has('test')).toBe(false);
    });

    it('should handle non-existent overlay gracefully', () => {
      expect(() => {
        domOverlay.removeOverlay('nonexistent');
      }).not.toThrow();
    });
  });

  describe('destroy()', () => {
    beforeEach(() => {
      domOverlay.init();
      domOverlay.createOverlay('test1', 100, 200, '<span>Test 1</span>');
      domOverlay.createOverlay('test2', 150, 250, '<span>Test 2</span>');
    });

    it('should remove all overlays and container', () => {
      domOverlay.destroy();

      expect(domOverlay.overlays.size).toBe(0);
      expect(domOverlay.container).toBeNull();
    });

    it('should clear all overlay elements from DOM', () => {
      const overlayElements = Array.from(domOverlay.overlays.values()).map(o => o.element);

      domOverlay.destroy();

      overlayElements.forEach(el => {
        expect(el.remove).toHaveBeenCalled();
      });
    });
  });
});
