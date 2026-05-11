/**
 * RootMagicManager.js — Phaser system for spell casting in battle
 *
 * Responsibilities:
 * - Cast spells from equipped hotbar slots
 * - Calculate spell damage (root mastery + affinity + grammar accuracy)
 * - Track combos across recent casts
 * - Sync with Redux (magicSlice, battleSlice)
 * - Emit magic VFX and cast events
 *
 * Not a Phaser.Scene — just a system class that receives scene reference (like EnemyAI).
 */

import { store } from '../../../store/store.js';
import {
  recordRootUse,
  recordCombo,
  clearBattleState,
  setLastCastTimestamp,
  selectEquippedSpells,
  selectAffinity,
} from '../../../store/slices/magicSlice.js';
import { spendMP, dealDamage } from '../../../store/slices/battleSlice.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { SPELL_TIERS } from '../../../data/rootMagic.js';
import { checkCombo } from '../../../data/elementCombos.js';

export class RootMagicManager {
  constructor(scene) {
    this.scene = scene;
    this.recentCasts = []; // Track last 5 spells cast for combo detection
  }

  /**
   * Cast a spell from an equipped hotbar slot
   * @param {number} slot - Hotbar slot index (0-5)
   * @param {number} targetIndex - Enemy index to target
   * @param {number} grammarAccuracy - Arabic input accuracy (0-1)
   * @returns {boolean} True if spell was cast successfully
   */
  castSpell(slot, targetIndex, grammarAccuracy) {
    const state = store.getState();
    const equippedSpells = selectEquippedSpells(state);
    const spell = equippedSpells[slot];

    // Validate spell exists
    if (!spell) {
      console.error(`[RootMagicManager] No spell equipped in slot ${slot}`);
      return false;
    }

    // Validate MP
    const playerMP = state.battle.playerMP;
    if (playerMP < spell.mpCost) {
      EventBus.emit(EVENTS.MAGIC_MP_DEPLETED, {
        slot,
        spellMPCost: spell.mpCost,
        playerMP,
      });
      return false;
    }

    // Spend MP
    store.dispatch(spendMP(spell.mpCost));

    // Update last cast timestamp
    store.dispatch(setLastCastTimestamp(Date.now()));

    // Emit VFX start event
    EventBus.emit(EVENTS.MAGIC_VFX_START, {
      element: spell.element,
      rootId: spell.rootId,
      targetIndex,
    });

    // Delayed damage and effects (after VFX animation)
    this.scene.time.delayedCall(800, () => {
      // Calculate spell damage
      const finalDamage = this._calculateSpellDamage(spell, grammarAccuracy);

      // Apply damage (magic always "correct" — accuracy affects multiplier instead)
      store.dispatch(
        dealDamage({
          damage: finalDamage,
          correct: true,
        })
      );

      // Record root use for mastery tracking
      store.dispatch(
        recordRootUse({
          rootId: spell.rootId,
          form: spell.form,
          accuracy: grammarAccuracy,
        })
      );

      // Check for combo opportunity
      this._checkComboOpportunity(spell);

      // Emit cast complete event
      EventBus.emit(EVENTS.MAGIC_CAST_COMPLETE, {
        damage: finalDamage,
        spell,
        rootId: spell.rootId,
      });

      // Emit VFX end event
      EventBus.emit(EVENTS.MAGIC_VFX_END);
    });

    return true;
  }

  /**
   * Calculate final spell damage with all multipliers
   * @param {Object} spell - Equipped spell object
   * @param {number} grammarAccuracy - Arabic input accuracy (0-1)
   * @returns {number} Final damage amount
   * @private
   */
  _calculateSpellDamage(spell, grammarAccuracy) {
    const state = store.getState();
    const rootMastery = state.magic.rootMastery[spell.rootId];
    const affinity = selectAffinity(state);

    // Base damage from spell tier
    const tierData = SPELL_TIERS[spell.form];
    const baseDamage = tierData.powerMult * 20; // Base 20 damage * form multiplier

    // Mastery multiplier (level 1 = 1.1x, level 10 = 2.0x)
    const rootLevel = rootMastery?.level || 1;
    const masteryMult = 1.0 + rootLevel * 0.1;

    // Affinity multiplier
    let affinityMult = 1.0;
    if (affinity.primary && spell.element === affinity.primary) {
      affinityMult = 2.0;
    } else if (affinity.secondary && spell.element === affinity.secondary) {
      affinityMult = 1.5;
    }

    // Grammar accuracy multiplier (consistent with BattleDamageCalculator pattern)
    let grammarMult = 1.0;
    if (grammarAccuracy >= 0.95) {
      grammarMult = 1.2; // Perfect
    } else if (grammarAccuracy >= 0.7) {
      grammarMult = 1.0; // Good
    } else {
      grammarMult = 0.5; // Partial
    }

    // Final damage (minimum 1)
    const finalDamage = Math.floor(baseDamage * masteryMult * affinityMult * grammarMult);
    return Math.max(1, finalDamage);
  }

  /**
   * Check if the current spell creates a combo with recent casts
   * @param {Object} spell - The spell just cast
   * @private
   */
  _checkComboOpportunity(spell) {
    const state = store.getState();
    const rootMastery = state.magic.rootMastery;

    // Check if we have a previous cast
    if (this.recentCasts.length >= 1) {
      const previousSpell = this.recentCasts[this.recentCasts.length - 1];

      // Check for combo
      const combo = checkCombo(previousSpell, spell, rootMastery);

      if (combo) {
        // Record combo in state
        store.dispatch(
          recordCombo({
            comboId: combo.id,
            elements: combo.elements,
            timestamp: Date.now(),
          })
        );

        // Emit combo event
        EventBus.emit(EVENTS.MAGIC_COMBO_TRIGGERED, {
          combo,
          damageMultiplier: combo.damageMultiplier,
        });

        // Apply bonus damage
        const bonusDamage = Math.floor(10 * combo.damageMultiplier);
        store.dispatch(
          dealDamage({
            damage: bonusDamage,
            correct: true,
          })
        );
      }
    }

    // Add to recent casts (cap at 5)
    this.recentCasts.push(spell);
    if (this.recentCasts.length > 5) {
      this.recentCasts.shift();
    }
  }

  /**
   * Reset battle-specific state when battle ends
   */
  resetBattleState() {
    this.recentCasts = [];
    store.dispatch(clearBattleState());
  }
}
