/**
 * Interior Entry Point
 * 
 * Re-exports the modular registry for backward compatibility.
 * New code should import from src/data/interiors/registry.js directly if needed,
 * but this file remains the main public API.
 */

import { INTERIORS } from './interiors/registry.js';
export { INTERIORS };

// Re-export templates if needed, or keeping them here for reference?
// Templates are now in src/data/interiors/templates/common.js
// We don't need to export them unless other files use them directly.
// InteriorScene only uses INTERIORS.
