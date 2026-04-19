/**
 * ActorRegistry — Unified lifecycle management for game actors.
 * Single source of truth for all active entities. Existing managers
 * (NPCManager, CompanionManager, etc.) continue working — future phases
 * can migrate them to register actors here.
 *
 * Actor types: 'npc', 'companion', 'interactable', 'gathering', 'trigger', 'projectile'
 */
export class ActorRegistry {
  constructor() {
    this._actors = new Map();
    this._byType = {};
  }

  register(id, type, sprite, data = {}) {
    this._actors.set(id, { id, type, sprite, data, active: true });
    if (!this._byType[type]) this._byType[type] = new Set();
    this._byType[type].add(id);
    return this;
  }

  unregister(id) {
    const actor = this._actors.get(id);
    if (!actor) return false;
    this._byType[actor.type]?.delete(id);
    this._actors.delete(id);
    return true;
  }

  get(id) {
    return this._actors.get(id) || null;
  }

  getByType(type) {
    const ids = this._byType[type];
    if (!ids) return [];
    return [...ids].map(id => this._actors.get(id)).filter(Boolean);
  }

  getAll() {
    return [...this._actors.values()];
  }

  getActive() {
    return [...this._actors.values()].filter(a => a.active);
  }

  setActive(id, active) {
    const actor = this._actors.get(id);
    if (actor) actor.active = active;
  }

  updateData(id, data) {
    const actor = this._actors.get(id);
    if (actor) Object.assign(actor.data, data);
  }

  count(type) {
    if (type) return this._byType[type]?.size || 0;
    return this._actors.size;
  }

  clear() {
    this._actors.clear();
    this._byType = {};
  }

  findNearest(type, x, y, maxDistance = Infinity) {
    const actors = this.getByType(type).filter(a => a.active && a.sprite);
    let nearest = null;
    let nearestDist = maxDistance;

    for (const actor of actors) {
      const dx = actor.sprite.x - x;
      const dy = actor.sprite.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = actor;
      }
    }

    return nearest;
  }
}

export const actorRegistry = new ActorRegistry();
