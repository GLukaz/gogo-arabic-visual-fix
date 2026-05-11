/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function validateDialoguePlugin() {
  return {
    name: 'validate-dialogue-data',
    async buildStart() {
      if (process.env.NODE_ENV !== 'production' && !process.argv.includes('build')) return;
      const { validateDialogueData } = await import('./src/data/dialogueSchema.js');
      const npcsPath = path.resolve(__dirname, 'src/data/npcs.json');
      const npcsData = JSON.parse(fs.readFileSync(npcsPath, 'utf-8'));
      const result = validateDialogueData(npcsData);
      if (!result.success) {
        throw new Error(`Dialogue data validation failed:\n${result.errors.join('\n')}`);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    validateDialoguePlugin(),
    process.env.ANALYZE === 'true' && visualizer({
      template: 'treemap',
      open: true,
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: false,
    }),
  ].filter(Boolean),
  publicDir: 'public',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core A1-A2 vocabulary (~700KB) — loaded eagerly
          if (id.includes('src/data/vocabulary-final.json') ||
            id.includes('src/data/vocabularyAll.js') ||
            id.includes('src/data/vocabularyByLevel.js') ||
            id.includes('src/data/vocabulary.json')) {
            return 'vocab-core';
          }
          // Extended B1-B2 vocabulary (~1,000KB) — loaded lazily
          if (id.includes('src/data/vocabularyExpanded.js')) {
            return 'vocab-extended';
          }
          // NPC metadata (lightweight, ~48KB — always loaded)
          if (id.includes('src/data/npcs-meta.json')) {
            return 'npc-meta';
          }
          // NPC dialogue loader + story arcs + profession teaching
          if (id.includes('src/data/npcDialogueLoader.js') ||
            id.includes('src/data/npcStoryArcs.js') ||
            id.includes('src/data/npcProfessionTeaching.js')) {
            return 'npc-data';
          }
          // NPC dialogue files are lazy-loaded per zone — let Vite auto-split
          // Quest data
          if (id.includes('src/data/quests.json')) {
            return 'quest-data';
          }
          // Grammar data
          if (id.includes('src/data/grammar.js') ||
            id.includes('src/data/grammarCombos.js')) {
            return 'grammar-data';
          }
          // Lore data
          if (id.includes('src/data/loreCodex.js')) {
            return 'lore-data';
          }
          // Compiled ink dialogue files
          if (id.includes('src/data/ink/') && id.endsWith('.ink.json')) {
            return 'ink-dialogue';
          }
          // Skill/achievement/faction data
          if (id.includes('src/data/skillTrees.js') ||
            id.includes('src/data/achievements.js') ||
            id.includes('src/data/factions.js') ||
            id.includes('src/data/factionEvents.js')) {
            return 'skill-data';
          }
          // Poetry battle data (lazy-loaded poems + service)
          if (id.includes('src/data/poems') ||
            id.includes('src/components/Poetry/')) {
            return 'poetry-game';
          }

          // Calligraphy mini-game (lazy-loaded Phaser scene + reference paths)
          if (id.includes('src/game/scenes/CalligraphyScene') ||
            id.includes('src/data/calligraphyPaths')) {
            return 'calligraphy-game';
          }

          if (id.includes('node_modules')) {
            // inkjs dialogue runtime
            if (id.includes('node_modules/inkjs')) {
              return 'ink-vendor';
            }
            // Phaser library (~1.2MB)
            if (id.includes('node_modules/phaser')) {
              return 'phaser';
            }
            // FSRS spaced repetition library
            if (id.includes('node_modules/ts-fsrs')) {
              return 'fsrs-vendor';
            }
            // React + ecosystem in one chunk to avoid circular deps
            if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/framer-motion')) {
              return 'react-vendor';
            }
            // Redux ecosystem (~200KB)
            if (id.includes('node_modules/redux') ||
              id.includes('node_modules/@reduxjs') ||
              id.includes('node_modules/react-redux')) {
              return 'redux-vendor';
            }
            // React Router (~100KB)
            if (id.includes('node_modules/react-router')) {
              return 'router-vendor';
            }
            // recharts + d3 sub-packages (~200KB)
            if (id.includes('node_modules/recharts') ||
                id.includes('node_modules/victory-vendor') ||
                id.includes('node_modules/d3-')) {
              return 'charts-vendor';
            }
            // All other node_modules - group with react to avoid circular
            return 'react-vendor';
          }
        },
      },
    },
  },
});
