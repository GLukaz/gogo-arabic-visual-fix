/**
 * eventBusTypes.js — Centralized EventBus event name registry
 *
 * Naming convention: source:category:action
 *   - source: where the event originates (phaser | react)
 *   - category: subsystem (player | npc | zone | object | quiz | nav | sfx | vfx | scene | battle)
 *   - action: what happened (verb or noun-verb)
 *
 * Old name → new constant mapping (for traceability):
 *   freeze-player             → PLAYER_FREEZE
 *   unfreeze-player           → PLAYER_UNFREEZE
 *   player-position-update    → PLAYER_POSITION_UPDATE
 *   player-stamina-update     → PLAYER_STAMINA_UPDATE
 *   npc-interact              → NPC_INTERACT
 *   zone-change               → ZONE_CHANGE
 *   zone-transition           → ZONE_TRANSITION
 *   check-zone-unlock         → ZONE_CHECK_UNLOCK
 *   fast-travel               → FAST_TRAVEL
 *   zone-loading-start        → ZONE_LOADING_START
 *   zone-loading-end          → ZONE_LOADING_END
 *   show-sign                 → SIGN_SHOW
 *   bookshelf-interact        → BOOKSHELF_INTERACT
 *   chest-opened              → CHEST_OPENED
 *   chest-empty               → CHEST_EMPTY
 *   door-locked               → DOOR_LOCKED
 *   door-opened               → DOOR_OPENED
 *   open-quiz                 → QUIZ_OPEN
 *   quiz-closed               → QUIZ_CLOSED
 *   open-review-session       → REVIEW_SESSION_OPEN
 *   open-alphabet             → ALPHABET_OPEN
 *   open-world-map            → WORLD_MAP_OPEN
 *   open-shop                 → SHOP_OPEN
 *   sfx-correct               → SFX_CORRECT
 *   sfx-wrong                 → SFX_WRONG
 *   sfx-wordlearned           → SFX_WORDLEARNED
 *   sfx-levelup               → SFX_LEVELUP
 *   sfx-quest                 → SFX_QUEST
 *   sfx-click                 → SFX_CLICK
 *   vfx-shake                 → VFX_SHAKE
 *   vfx-particles-burst       → VFX_PARTICLES_BURST
 *   vfx-particles-continuous  → VFX_PARTICLES_CONTINUOUS
 *   scene-ready               → SCENE_READY
 *   outfit-changed            → OUTFIT_CHANGED
 *   boss-dialogue             → BOSS_DIALOGUE
 */

export const EVENTS = Object.freeze({
  // ────────────────────────────────────────────────
  // PLAYER — movement, state, and stamina events
  // ────────────────────────────────────────────────
  /** React → Phaser: freeze player movement (e.g. when overlay opens) */
  PLAYER_FREEZE: 'react:player:freeze',
  /** React → Phaser: unfreeze player movement (e.g. when overlay closes) */
  PLAYER_UNFREEZE: 'react:player:unfreeze',
  /** Phaser → React: player world position for HUD compass (throttled ~10Hz) */
  PLAYER_POSITION_UPDATE: 'phaser:player:position-update',
  /** Phaser → React: player stamina for HUD bar (emitted while sprinting/recharging) */
  PLAYER_STAMINA_UPDATE: 'phaser:player:stamina-update',
  /** React → Phaser: player outfit changed, update Phaser sprite */
  OUTFIT_CHANGED: 'react:player:outfit-changed',

  // ────────────────────────────────────────────────
  // NPC — dialogue and interaction
  // ────────────────────────────────────────────────
  /** Phaser → React: player pressed SPACE near NPC, open dialogue overlay */
  NPC_INTERACT: 'phaser:npc:interact',
  /** Phaser → Phaser: route simple NPC dialogue to in-canvas DialogueBox */
  NPC_SIMPLE_DIALOGUE: 'phaser:npc:simple-dialogue',

  // ────────────────────────────────────────────────
  // DIALOGUE — dialogue lifecycle events (Phase 20)
  // ────────────────────────────────────────────────
  /** React → React: start an ink-scripted dialogue (path choice, scripted NPC events) */
  INK_DIALOGUE_START: 'react:dialogue:ink-start',
  /** React → React: ink-scripted dialogue finished (all lines + choices consumed) */
  INK_DIALOGUE_END: 'react:dialogue:ink-end',
  /** React → Phaser: player selected a topic from hub menu */
  DIALOGUE_TOPIC_SELECTED: 'react:dialogue:topic-selected',
  /** Phaser → React: dialogue effect executed (for UI feedback) */
  DIALOGUE_EFFECT_EXECUTED: 'react:dialogue:effect-executed',
  /** React → Phaser: request mid-dialogue quiz */
  DIALOGUE_QUIZ_REQUESTED: 'react:dialogue:quiz-requested',
  /** React → React: dialogue conversation ended normally */
  DIALOGUE_ENDED: 'react:dialogue:ended',
  /** React → React: relationship changed during dialogue (for UI feedback) */
  DIALOGUE_RELATIONSHIP_CHANGED: 'react:dialogue:relationship-changed',

  // ────────────────────────────────────────────────
  // ZONE — transitions, unlock gating, fast travel
  // ────────────────────────────────────────────────
  /** Phaser → React: player entered a new zone, update Redux currentZone */
  ZONE_CHANGE: 'phaser:zone:change',
  /** React → Phaser: trigger WorldScene.zoneTransition.transitionTo() */
  ZONE_TRANSITION: 'phaser:zone:transition',
  /** Phaser → React: player stepped on exit trigger, check unlock requirements */
  ZONE_CHECK_UNLOCK: 'phaser:zone:check-unlock',
  /** React → React: zone gate blocked, show requirements to player */
  ZONE_GATE_BLOCKED: 'react:zone:gate-blocked',
  /** Phaser → React: zone-specific assets are loading (during fade-out) */
  ZONE_LOADING_START: 'phaser:zone:loading-start',
  /** Phaser → React: zone-specific asset loading complete */
  ZONE_LOADING_END: 'phaser:zone:loading-end',
  /** React → Phaser: fast travel from world map to target zone */
  FAST_TRAVEL: 'react:zone:fast-travel',

  // ────────────────────────────────────────────────
  // OBJECTS — interactable world objects
  // ────────────────────────────────────────────────
  /** Phaser → React: player interacted with a sign object */
  SIGN_SHOW: 'phaser:object:sign-show',
  /** Phaser → React: player interacted with a bookshelf */
  BOOKSHELF_INTERACT: 'phaser:object:bookshelf-interact',
  /** Phaser → React: player opened a chest (first time) */
  CHEST_OPENED: 'phaser:object:chest-opened',
  /** Phaser → React: player tried to open an already-opened chest */
  CHEST_EMPTY: 'phaser:object:chest-empty',
  /** Phaser → React: player tried to open a locked door */
  DOOR_LOCKED: 'phaser:object:door-locked',
  /** Phaser → React: player opened an unlocked door */
  DOOR_OPENED: 'phaser:object:door-opened',
  /** Phaser → React: player interacted with a world object (fountain, statue, etc.) */
  OBJECT_INTERACT: 'phaser:object:world-interact',

  // ────────────────────────────────────────────────
  // QUIZ / LEARNING — quiz lifecycle and navigation
  // ────────────────────────────────────────────────
  /** Phaser → React: open the quiz overlay with config */
  QUIZ_OPEN: 'phaser:quiz:open',
  /** React → (internal): quiz overlay closed, resume BGM */
  QUIZ_CLOSED: 'react:quiz:closed',
  /** React → React: trigger micro-review overlay with 2-3 due words on zone entry */
  MICRO_REVIEW_TRIGGER: 'react:quiz:micro-review-trigger',
  /** React → React: navigate to /review (spaced repetition session) */
  REVIEW_SESSION_OPEN: 'react:nav:open-review',
  /** React → React: navigate to /alphabet */
  ALPHABET_OPEN: 'react:nav:open-alphabet',
  /** React → React: navigate to /game/map (world map overlay) */
  WORLD_MAP_OPEN: 'react:nav:open-world-map',
  /** React → React: open NPC shop overlay */
  SHOP_OPEN: 'react:nav:open-shop',

  // ────────────────────────────────────────────────
  // SFX — sound effects triggered from React side
  // ────────────────────────────────────────────────
  /** React/Phaser → React: play correct-answer sound */
  SFX_CORRECT: 'react:sfx:correct',
  /** React/Phaser → React: play wrong-answer sound */
  SFX_WRONG: 'react:sfx:wrong',
  /** React → React: play word-learned fanfare */
  SFX_WORDLEARNED: 'react:sfx:wordlearned',
  /** React → React: play level-up fanfare */
  SFX_LEVELUP: 'react:sfx:levelup',
  /** React → React: play quest-complete sound */
  SFX_QUEST: 'react:sfx:quest',
  /** React → React: play UI click sound */
  SFX_CLICK: 'react:sfx:click',

  // ────────────────────────────────────────────────
  // VFX — visual effects in Phaser
  // ────────────────────────────────────────────────
  /** React → Phaser: screen shake with configurable intensity */
  VFX_SHAKE: 'phaser:vfx:shake',
  /** React → Phaser: single burst of particles at position */
  VFX_PARTICLES_BURST: 'phaser:vfx:particles-burst',
  /** React → Phaser: continuous particle emitter for duration */
  VFX_PARTICLES_CONTINUOUS: 'phaser:vfx:particles-continuous',

  // ────────────────────────────────────────────────
  // NARRATIVE — story flags, relationships (Phase 20+)
  // ────────────────────────────────────────────────
  /** React → Redux: set a story flag in narrativeSlice */
  NARRATIVE_FLAG_SET: 'react:narrative:flag-set',
  /** React → Redux: change NPC relationship level in narrativeSlice */
  NARRATIVE_RELATIONSHIP_CHANGED: 'react:narrative:relationship-changed',

  // ────────────────────────────────────────────────
  // TIME — Day/night cycle and time system
  // ────────────────────────────────────────────────
  /** Phaser → Phaser: time phase changed (dawn/day/dusk/night) */
  TIME_PHASE_CHANGED: 'phaser:time:phase-changed',
  /** Phaser → Phaser: time tick (periodic updates) */
  TIME_TICK: 'phaser:time:tick',

  // ────────────────────────────────────────────────
  // NOTIFICATIONS — UI notification events
  // ────────────────────────────────────────────────
  /** Phaser → React: show a notification toast */
  SHOW_NOTIFICATION: 'react:ui:show-notification',

  // ────────────────────────────────────────────────
  // SCENE — Phaser scene lifecycle
  // ────────────────────────────────────────────────
  /** Phaser → React: BootScene/WorldScene finished initializing */
  SCENE_READY: 'phaser:scene:ready',
  /** Phaser → React: WorldScene shutting down, disallow event emissions */
  SCENE_SHUTDOWN: 'phaser:scene:shutdown',
  /** Phaser → Phaser: building entered, interior scene launched */
  BUILDING_ENTERED: 'phaser:scene:building-entered',
  /** Phaser → Phaser: building exited, WorldScene resumed */
  BUILDING_EXITED: 'phaser:scene:building-exited',

  // ────────────────────────────────────────────────
  // BATTLE — Word Duel boss fight events (v5.0 legacy)
  // ────────────────────────────────────────────────
  /** React → React: display boss dialogue line during battle */
  BOSS_DIALOGUE: 'react:battle:boss-dialogue',

  // ────────────────────────────────────────────────
  // BATTLE v6.0 — Turn-based BattleScene events
  // ────────────────────────────────────────────────

  // React → Phaser BattleScene
  /** React → Phaser: player selected an action (Attack/Magic/Item/Defend/Flee) */
  BATTLE_ACTION_SELECTED: 'react:battle:action-selected',
  /** React → Phaser: player submitted Arabic answer */
  BATTLE_ARABIC_INPUT: 'react:battle:arabic-input',
  /** React → Phaser: player chose to flee */
  BATTLE_FLEE_REQUESTED: 'react:battle:flee-requested',
  /** React → Phaser: player used an item */
  BATTLE_ITEM_USED: 'react:battle:item-used',

  // Phaser BattleScene → React
  /** Phaser → React: battle initialized, show battle UI */
  BATTLE_STARTED: 'phaser:battle:started',
  /** Phaser → React: battle over, show results overlay */
  BATTLE_ENDED: 'phaser:battle:ended',
  /** Phaser → React: FSM state transition, update React menu */
  BATTLE_STATE_CHANGED: 'phaser:battle:state-changed',
  /** Phaser → React: show Arabic input prompt to player */
  BATTLE_PROMPT_WORD: 'phaser:battle:prompt-word',
  /** Phaser → React: animation done, enable next input */
  BATTLE_TURN_RESOLVED: 'phaser:battle:turn-resolved',
  /** Phaser → React: enemy is acting, show enemy intent */
  BATTLE_ENEMY_ACTION: 'phaser:battle:enemy-action',
  /** Phaser → React: combo counter changed */
  BATTLE_COMBO_UPDATE: 'phaser:battle:combo-update',

  // ────────────────────────────────────────────────
  // MAGIC — Root magic system events (Phase 28)
  // ────────────────────────────────────────────────

  /** React → Phaser: player selected spell from hotbar */
  MAGIC_CAST_REQUESTED: 'react:magic:cast-requested',
  /** Phaser → React: spell cast resolved, update UI */
  MAGIC_CAST_COMPLETE: 'phaser:magic:cast-complete',
  /** Phaser → React: new root unlocked, show toast */
  MAGIC_ROOT_DISCOVERED: 'phaser:magic:root-discovered',
  /** React → Phaser: hotbar slot changed */
  MAGIC_SPELL_EQUIPPED: 'react:magic:spell-equipped',
  /** React → Phaser: hotbar slot cleared */
  MAGIC_SPELL_UNEQUIPPED: 'react:magic:spell-unequipped',
  /** Phaser → React: combo detected, show combo VFX */
  MAGIC_COMBO_TRIGGERED: 'phaser:magic:combo-triggered',
  /** React → Redux: affinity choice made */
  MAGIC_AFFINITY_CHOICE: 'react:magic:affinity-choice',
  /** Redux → React: primary/secondary affinity locked */
  MAGIC_AFFINITY_LOCKED: 'react:magic:affinity-locked',
  /** Phaser → React: root mastery leveled up */
  MAGIC_ROOT_LEVEL_UP: 'phaser:magic:root-level-up',
  /** Phaser → React: new verb form unlocked */
  MAGIC_FORM_UNLOCKED: 'phaser:magic:form-unlocked',
  /** Phaser → React: not enough MP warning */
  MAGIC_MP_DEPLETED: 'phaser:magic:mp-depleted',
  /** React → Phaser: freeze game while viewing spells */
  MAGIC_SPELL_MENU_OPEN: 'react:magic:spell-menu-open',
  /** React → Phaser: resume game */
  MAGIC_SPELL_MENU_CLOSE: 'react:magic:spell-menu-close',
  /** Phaser → React: spell VFX started (disable input) */
  MAGIC_VFX_START: 'phaser:magic:vfx-start',
  /** Phaser → React: spell VFX ended (enable input) */
  MAGIC_VFX_END: 'phaser:magic:vfx-end',

  // ────────────────────────────────────────────────
  // EQUIPMENT — Equipment and inventory events (Phase 29)
  // ────────────────────────────────────────────────

  /** React → Phaser: equipment slot changed */
  EQUIPMENT_CHANGED: 'react:equipment:changed',
  /** React → Phaser: recalculate bonuses */
  EQUIPMENT_STATS_UPDATED: 'react:equipment:stats-updated',
  /** React → React: new item acquired */
  INVENTORY_ITEM_ADDED: 'react:inventory:item-added',
  /** React → React: item removed/sold */
  INVENTORY_ITEM_REMOVED: 'react:inventory:item-removed',
  /** React → React: inventory at 200 cap */
  INVENTORY_FULL: 'react:inventory:full',

  // ────────────────────────────────────────────────
  // SHOP — Shop and economy events (Phase 29)
  // ────────────────────────────────────────────────

  /** React → React: item bought */
  SHOP_PURCHASE: 'react:shop:purchase',
  /** React → React: item sold */
  SHOP_SELL: 'react:shop:sell',
  /** React → React: haggling began */
  SHOP_HAGGLE_START: 'react:shop:haggle-start',
  /** React → React: haggle success/fail */
  SHOP_HAGGLE_RESULT: 'react:shop:haggle-result',
  /** React → React: shop inventory refreshed */
  SHOP_RESTOCK: 'react:shop:restock',
  /** React → React: new Arabic word from equipment */
  AFFIX_DISCOVERED: 'react:equipment:affix-discovered',

  // ────────────────────────────────────────────────
  // COMPANION — Companion system events (Phase 30)
  // ────────────────────────────────────────────────

  /** React → Phaser: companion joined party */
  COMPANION_RECRUITED: 'react:companion:recruited',
  /** React → Phaser: companion removed from active party */
  COMPANION_DISMISSED: 'react:companion:dismissed',
  /** React → Phaser: active battle/exploration companion changed */
  COMPANION_PARTY_CHANGED: 'react:companion:party-changed',
  /** React → React: player gave gift to companion */
  COMPANION_GIFT_GIVEN: 'react:companion:gift-given',
  /** React → React: relationship level increased */
  COMPANION_RELATIONSHIP_UP: 'react:companion:relationship-up',
  /** Phaser → React: companion makes zone/object comment */
  COMPANION_CONTEXTUAL_COMMENT: 'phaser:companion:contextual-comment',
  /** Phaser → React: companion selected battle action */
  COMPANION_BATTLE_ACTION: 'phaser:companion:battle-action',
  /** Phaser → React: companion's turn began */
  COMPANION_BATTLE_TURN_START: 'phaser:companion:turn-start',
  /** Phaser → React: companion's turn ended */
  COMPANION_BATTLE_TURN_END: 'phaser:companion:turn-end',
  /** Phaser → React: companion started following player */
  COMPANION_FOLLOW_START: 'phaser:companion:follow-start',
  /** Phaser → React: companion stopped following */
  COMPANION_FOLLOW_STOP: 'phaser:companion:follow-stop',
  /** React → React: companion mood shifted */
  COMPANION_MOOD_CHANGED: 'react:companion:mood-changed',

  // ────────────────────────────────────────────────
  // CRAFTING — Crafting and profession events (Phase 31)
  // ────────────────────────────────────────────────

  /** React → Redux: player learned a new profession */
  CRAFTING_PROFESSION_LEARNED: 'react:crafting:profession-learned',
  /** React → Redux: profession leveled up */
  CRAFTING_PROFESSION_LEVEL_UP: 'react:crafting:profession-level-up',
  /** React → Redux: new recipe unlocked */
  CRAFTING_RECIPE_UNLOCKED: 'react:crafting:recipe-unlocked',
  /** React → Phaser: player crafted an item */
  CRAFTING_ITEM_CRAFTED: 'react:crafting:item-crafted',
  /** React → React: crafting minigame started */
  CRAFTING_MINIGAME_START: 'react:crafting:minigame-start',
  /** React → React: crafting minigame completed */
  CRAFTING_MINIGAME_COMPLETE: 'react:crafting:minigame-complete',
  /** Phaser → React: player gathered resource from spot */
  CRAFTING_RESOURCE_GATHERED: 'phaser:crafting:resource-gathered',
  /** React → React: recipe book UI opened */
  CRAFTING_RECIPE_BOOK_OPEN: 'react:crafting:recipe-book-open',
  /** React → React: recipe book UI closed */
  CRAFTING_RECIPE_BOOK_CLOSE: 'react:crafting:recipe-book-close',
  /** Phaser → React: gathering spot became available */
  GATHERING_SPOT_READY: 'phaser:crafting:gathering-spot-ready',
  /** Phaser → React: gathering spot depleted (on cooldown) */
  GATHERING_SPOT_DEPLETED: 'phaser:crafting:gathering-spot-depleted',

  // ────────────────────────────────────────────────
  // BATTLE PHASE 32 — Status Effects & Advanced Combat
  // ────────────────────────────────────────────────

  /** Phaser → React: status effect applied to player or enemy */
  BATTLE_STATUS_APPLIED: 'phaser:battle:status-applied',
  /** Phaser → React: compound effect triggered from two components */
  BATTLE_COMPOUND_TRIGGERED: 'phaser:battle:compound-triggered',
  /** Phaser → React: combo chain built from consecutive correct answers */
  BATTLE_COMBO_CHAIN: 'phaser:battle:combo-chain',
  /** Phaser → React: grammar combo triggered (sentence-level attack) */
  BATTLE_GRAMMAR_COMBO: 'phaser:battle:grammar-combo',
  /** Phaser → React: flee challenge initiated */
  BATTLE_FLEE_CHALLENGE: 'phaser:battle:flee-challenge',
  /** Phaser → React: flee attempt failed */
  BATTLE_FLEE_FAILED: 'phaser:battle:flee-failed',
  /** React → Phaser: player selected a target in multi-enemy battle */
  BATTLE_TARGET_SELECT: 'phaser:battle:target-select',
  /** React → Phaser: item menu opened during battle */
  BATTLE_ITEM_MENU_OPEN: 'phaser:battle:item-menu-open',
  /** React → React: post-battle vocabulary review started */
  BATTLE_POST_REVIEW: 'phaser:battle:post-review',

  // ────────────────────────────────────────────────
  // ARENA — Arena wave-based combat (Phase 32)
  // ────────────────────────────────────────────────

  /** Phaser → React: new arena wave starting */
  ARENA_WAVE_START: 'phaser:arena:wave-start',
  /** Phaser → React: arena wave completed */
  ARENA_WAVE_COMPLETE: 'phaser:arena:wave-complete',
  /** Phaser → React: arena fully completed (all waves cleared) */
  ARENA_COMPLETE: 'phaser:arena:complete',
  /** Redux → React: arena score submitted to leaderboard */
  ARENA_SCORE_SUBMITTED: 'redux:arena:score-submitted',

  // ────────────────────────────────────────────────
  // BOSS RUSH — Sequential boss fights with story interludes (Phase 32)
  // ────────────────────────────────────────────────

  /** Phaser → React: show story interlude between boss rush fights */
  BOSS_RUSH_INTERLUDE: 'phaser:boss-rush:interlude',
  /** React → Phaser: player dismissed interlude, continue to next boss */
  BOSS_RUSH_CONTINUE: 'react:boss-rush:continue',
  /** Phaser → React: boss rush started */
  BOSS_RUSH_STARTED: 'phaser:boss-rush:started',
  /** Phaser → React: individual boss defeated in rush */
  BOSS_RUSH_BOSS_DEFEATED: 'phaser:boss-rush:boss-defeated',

  // ────────────────────────────────────────────────
  // PUZZLE BATTLE — Arabic knowledge-gated encounters (Phase 32)
  // ────────────────────────────────────────────────

  /** Phaser → React: puzzle challenge presented to player */
  PUZZLE_CHALLENGE: 'phaser:puzzle:challenge',
  /** React → Phaser: player submitted puzzle answer */
  PUZZLE_ANSWER_SUBMITTED: 'react:puzzle:answer-submitted',
  /** Phaser → React: puzzle answer result (correct/incorrect + damage) */
  PUZZLE_ANSWER_RESULT: 'phaser:puzzle:answer-result',
  /** Phaser → React: puzzle battle completed (victory or defeat) */
  PUZZLE_COMPLETE: 'phaser:puzzle:complete',

  // ────────────────────────────────────────────────
  // ACTION SET — Data-driven NPC action execution (Phase 34)
  // ────────────────────────────────────────────────

  /** ActionSetExecutor → DialogueEngine: play NPC speech line by key */
  ACTION_SPEECH: 'action:npc:speech',
  /** ActionSetExecutor → questSlice: start a quest by id */
  ACTION_START_QUEST: 'action:quest:start',
  /** ActionSetExecutor → questSlice: complete a quest by id */
  ACTION_COMPLETE_QUEST: 'action:quest:complete',
  /** ActionSetExecutor → inventorySlice: give item(s) to player */
  ACTION_GIVE_ITEM: 'action:inventory:give-item',
  /** ActionSetExecutor → vocabularySlice: teach a new vocabulary word */
  ACTION_TEACH_WORD: 'action:vocab:teach-word',
  /** ActionSetExecutor → narrativeSlice: set a story flag value */
  ACTION_SET_FLAG: 'action:narrative:set-flag',
  /** ActionSetExecutor → BattleScene: initiate a battle encounter */
  ACTION_BATTLE: 'action:battle:start',
  /** ActionSetExecutor → ZoneTransition: teleport player to zone/coords */
  ACTION_TELEPORT: 'action:zone:teleport',
  /** ActionSetExecutor → AudioManager: play a sound effect or BGM cue */
  ACTION_PLAY_SOUND: 'action:audio:play-sound',

  // ────────────────────────────────────────────────
  // CALLIGRAPHY — Arabic letter tracing mini-game (Phase 55)
  // ────────────────────────────────────────────────

  /** Phaser CalligraphyScene → React: player completed a stroke; includes letterId, stars, frechetDistance */
  CALLIGRAPHY_STROKE_COMPLETE: 'phaser:calligraphy:stroke-complete',
  /** Phaser CalligraphyScene → React: player exited calligraphy scene */
  CALLIGRAPHY_SCENE_EXIT: 'phaser:calligraphy:scene-exit',
  /** React MiniGamesHub → GameLayout: request to launch CalligraphyScene in Phaser */
  CALLIGRAPHY_LAUNCH_REQUESTED: 'react:calligraphy:launch-requested',

  // ────────────────────────────────────────────────
  // SYSTEM — AutoSave, stats, sub-areas (Phase 36)
  // ────────────────────────────────────────────────

  /** System → React: autosave triggered (show brief indicator) */
  AUTOSAVE_TRIGGERED: 'system:autosave:triggered',
  /** Phaser → React: player entered a named sub-area within a zone */
  SUB_AREA_ENTER: 'phaser:zone:sub-area-enter',
  /** Phaser → React: player left a named sub-area */
  SUB_AREA_EXIT: 'phaser:zone:sub-area-exit',
  /** React → React: journal overlay opened */
  JOURNAL_OPEN: 'react:ui:journal-open',
  /** System → React: calendar event is active today (Ramadan, Eid, Friday) */
  CALENDAR_EVENT_ACTIVE: 'system:calendar:event-active',

  // ────────────────────────────────────────────────
  // POETRY — Poetry battle events (Phase 55)
  // ────────────────────────────────────────────────

  /** React → React: start a poetry battle with an NPC poet */
  POETRY_BATTLE_START: 'react:poetry:battle-start',
  /** React → React: poetry battle ended (show results) */
  POETRY_BATTLE_END: 'react:poetry:battle-end',
  /** React → React: player submitted answer for current blank */
  POETRY_ANSWER_SUBMITTED: 'react:poetry:answer-submitted',

  // ────────────────────────────────────────────────
  // CEFR — CEFR level milestone events (Phase 64)
  // ────────────────────────────────────────────────

  /** Redux middleware → React: player reached a new CEFR level, trigger Amira milestone dialogue */
  CEFR_MILESTONE_REACHED: 'react:cefr:milestone-reached',
});
