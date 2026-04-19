/**
 * CompanionBattleAI.js — Role-based behavior tree for autonomous companion battle actions
 *
 * Each companion role (healer/attacker/defender/support) has a priority-based decision tree
 * that selects actions based on battle state (HP, MP, effects).
 *
 * Relationship bonuses scale damage and healing from 1.0 (stranger) to 1.2 (best friend).
 */

import { store } from '../../../store/store.js';
import { COMPANIONS } from '../../../data/companions.js';
import { getRelationshipMultiplier } from '../../../utils/companionRelationship.js';

export class CompanionBattleAI {
  constructor(companionId) {
    this.companionId = companionId;
    const companionDef = COMPANIONS[companionId];
    this.role = companionDef?.battleRole || 'attacker';
    this.baseStats = companionDef?.baseStats || { hp: 60, mp: 40, damage: 10, defense: 5 };
  }

  /**
   * Select the best action based on role-based behavior tree.
   * @param {Object} battleState — { playerHP, playerMaxHP, companionHP, companionMaxHP, companionMP, enemyHP, enemyMaxHP, playerEffects, companionEffects, enemyEffects }
   * @returns {Object} — { action, target, mpCost?, effectId?, damage?, healAmount?, duration? }
   */
  selectAction(battleState) {
    const relationship = store.getState().companions?.companions?.[this.companionId]?.relationship ?? 0;
    const multiplier = getRelationshipMultiplier(relationship);

    switch (this.role) {
      case 'healer':
        return this._healerTree(battleState, multiplier);
      case 'attacker':
        return this._attackerTree(battleState, multiplier);
      case 'defender':
        return this._defenderTree(battleState, multiplier);
      case 'support':
        return this._supportTree(battleState, multiplier);
      default:
        return { action: 'attack', target: 'enemy', damage: Math.floor(this.baseStats.damage * multiplier) };
    }
  }

  /**
   * Healer behavior tree — prioritizes healing low HP targets.
   * @private
   */
  _healerTree(battleState, multiplier) {
    const { playerHP, playerMaxHP, companionHP, companionMaxHP, companionMP } = battleState;

    // Priority 1: If player HP < 40% AND companion MP >= 15 → strong heal on player
    if (playerHP / playerMaxHP < 0.4 && companionMP >= 15) {
      return {
        action: 'heal',
        target: 'player',
        mpCost: 15,
        healAmount: Math.floor(30 * multiplier),
      };
    }

    // Priority 2: If companion HP < 40% AND companion MP >= 15 → self heal
    if (companionHP / companionMaxHP < 0.4 && companionMP >= 15) {
      return {
        action: 'heal',
        target: 'companion',
        mpCost: 15,
        healAmount: Math.floor(25 * multiplier),
      };
    }

    // Priority 3: If player HP < 70% AND companion MP >= 10 → light heal on player
    if (playerHP / playerMaxHP < 0.7 && companionMP >= 10) {
      return {
        action: 'heal',
        target: 'player',
        mpCost: 10,
        healAmount: Math.floor(20 * multiplier),
      };
    }

    // Fallback: weak attack
    return {
      action: 'attack',
      target: 'enemy',
      damage: Math.floor(this.baseStats.damage * 0.7 * multiplier),
    };
  }

  /**
   * Attacker behavior tree — prioritizes damage output.
   * @private
   */
  _attackerTree(battleState, multiplier) {
    const { enemyHP, enemyMaxHP, companionMP } = battleState;

    // Priority 1: If enemy HP > 50% of max AND companion MP >= 20 → use skill
    if (enemyHP / enemyMaxHP > 0.5 && companionMP >= 20) {
      return {
        action: 'skill',
        target: 'enemy',
        mpCost: 20,
        damage: Math.floor(this.baseStats.damage * 2.0 * multiplier),
      };
    }

    // Priority 2: If enemy HP < 25% of max → finish off attack (bonus damage)
    if (enemyHP / enemyMaxHP < 0.25) {
      return {
        action: 'attack',
        target: 'enemy',
        damage: Math.floor(this.baseStats.damage * 1.5 * multiplier),
      };
    }

    // Fallback: normal attack
    return {
      action: 'attack',
      target: 'enemy',
      damage: Math.floor(this.baseStats.damage * multiplier),
    };
  }

  /**
   * Defender behavior tree — prioritizes protecting player and dispelling enemy buffs.
   * @private
   */
  _defenderTree(battleState, multiplier) {
    const { playerHP, playerMaxHP, enemyEffects, companionMP } = battleState;

    // Priority 1: If player HP < 50% → defend player (next attack redirected to companion at 50% damage)
    if (playerHP / playerMaxHP < 0.5) {
      return {
        action: 'defend',
        target: 'player',
      };
    }

    // Priority 2: If any enemy buff active AND companion MP >= 10 → dispel
    if (enemyEffects.length > 0 && companionMP >= 10) {
      return {
        action: 'dispel',
        target: 'enemy',
        mpCost: 10,
      };
    }

    // Fallback: weak attack
    return {
      action: 'attack',
      target: 'enemy',
      damage: Math.floor(this.baseStats.damage * 0.8 * multiplier),
    };
  }

  /**
   * Support behavior tree — prioritizes buffing player with various effects.
   * @private
   */
  _supportTree(battleState, multiplier) {
    const { playerEffects, companionMP } = battleState;

    // Priority 1: If player has no 'strength' buff AND companion MP >= 12 → buff strength
    const hasStrength = playerEffects.some(e => e.id === 'strength');
    if (!hasStrength && companionMP >= 12) {
      return {
        action: 'buff',
        target: 'player',
        effectId: 'strength',
        mpCost: 12,
        duration: 3,
      };
    }

    // Priority 2: If player has no 'defense_up' buff AND companion MP >= 10 → buff defense
    const hasDefenseUp = playerEffects.some(e => e.id === 'defense_up');
    if (!hasDefenseUp && companionMP >= 10) {
      return {
        action: 'buff',
        target: 'player',
        effectId: 'defense_up',
        mpCost: 10,
        duration: 3,
      };
    }

    // Priority 3: If companion MP >= 8 → buff accuracy
    if (companionMP >= 8) {
      return {
        action: 'buff',
        target: 'player',
        effectId: 'accuracy_up',
        mpCost: 8,
        duration: 2,
      };
    }

    // Fallback: weak attack
    return {
      action: 'attack',
      target: 'enemy',
      damage: Math.floor(this.baseStats.damage * 0.6 * multiplier),
    };
  }

  /**
   * Get companion stats scaled by relationship multiplier.
   * @param {number} multiplier — 1.0 to 1.2 based on relationship tier
   * @returns {Object} — { hp, mp, damage, defense }
   */
  getScaledStats(multiplier) {
    return {
      hp: this.baseStats.hp,
      mp: this.baseStats.mp,
      damage: Math.floor(this.baseStats.damage * multiplier),
      defense: Math.floor(this.baseStats.defense * multiplier),
    };
  }

  /**
   * Get bilingual action description for UI display.
   * @param {Object} action — { action, target, ... }
   * @returns {Object} — { arabic, english }
   */
  getActionDescription(action) {
    const actionMap = {
      attack: { arabic: 'هجوم', english: 'Attack' },
      skill: { arabic: 'مهارة', english: 'Skill' },
      heal: { arabic: 'شفاء', english: 'Heal' },
      defend: { arabic: 'دفاع', english: 'Defend' },
      buff: { arabic: 'تعزيز', english: 'Buff' },
      dispel: { arabic: 'إزالة', english: 'Dispel' },
    };

    return actionMap[action.action] || { arabic: 'فعل', english: 'Action' };
  }
}
