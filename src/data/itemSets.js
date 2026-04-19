/**
 * itemSets.js — Equipment set bonus definitions (Phase 29)
 *
 * Defines themed equipment sets with 2-piece and 4-piece bonuses.
 */

export const ITEM_SETS = {
  scholars_set: {
    name: "Scholar's Collection",
    nameArabic: 'مجموعة العالم',
    items: ['scholars_kufi', 'scholars_robe', 'scholars_cloak', 'scholars_belt', 'scholars_khuff'],
    bonuses: {
      2: {
        mp: 20,
        description: '2-piece: +20 MP',
        descriptionArabic: 'قطعتان: +٢٠ نقطة سحر',
      },
      4: {
        mp: 50,
        damage: 0.10,
        description: '4-piece: +50 MP, +10% spell damage',
        descriptionArabic: 'أربع قطع: +٥٠ نقطة سحر، +١٠٪ ضرر التعويذة',
      },
    },
  },

  merchants_set: {
    name: "Merchant's Collection",
    nameArabic: 'مجموعة التاجر',
    items: ['merchants_turban', 'merchants_abaya', 'merchants_bisht', 'merchants_sash', 'merchants_shoes'],
    bonuses: {
      2: {
        hp: 25,
        description: '2-piece: +25 HP',
        descriptionArabic: 'قطعتان: +٢٥ نقطة حياة',
      },
      4: {
        hp: 60,
        defense: 0.08,
        description: '4-piece: +60 HP, +8% defense',
        descriptionArabic: 'أربع قطع: +٦٠ نقطة حياة، +٨٪ دفاع',
      },
    },
  },

  warriors_set: {
    name: "Warrior's Arsenal",
    nameArabic: 'ترسانة المحارب',
    items: ['warriors_helmet', 'warriors_jubbah', 'warriors_farwa', 'warriors_mintaqa', 'warriors_boots', 'warriors_gauntlets'],
    bonuses: {
      2: {
        damage: 0.08,
        description: '2-piece: +8% damage',
        descriptionArabic: 'قطعتان: +٨٪ ضرر',
      },
      4: {
        damage: 0.20,
        defense: 0.15,
        description: '4-piece: +20% damage, +15% defense',
        descriptionArabic: 'أربع قطع: +٢٠٪ ضرر، +١٥٪ دفاع',
      },
      6: {
        damage: 0.35,
        defense: 0.25,
        hp: 50,
        description: '6-piece: +35% damage, +25% defense, +50 HP',
        descriptionArabic: 'ست قطع: +٣٥٪ ضرر، +٢٥٪ دفاع، +٥٠ نقطة حياة',
      },
    },
  },

  healers_set: {
    name: "Healer's Vestments",
    nameArabic: 'ثياب المعالج',
    items: ['healers_robe', 'burda_of_blessing', 'emerald_pendant'],
    bonuses: {
      2: {
        hp: 30,
        mp: 30,
        description: '2-piece: +30 HP, +30 MP',
        descriptionArabic: 'قطعتان: +٣٠ نقطة حياة، +٣٠ نقطة سحر',
      },
      3: {
        hp: 80,
        mp: 80,
        defense: 0.10,
        description: '3-piece: +80 HP, +80 MP, +10% defense, healing effects increased',
        descriptionArabic: 'ثلاث قطع: +٨٠ نقطة حياة، +٨٠ نقطة سحر، +١٠٪ دفاع، تأثيرات الشفاء متزايدة',
      },
    },
  },

  explorers_set: {
    name: "Explorer's Gear",
    nameArabic: 'معدات المستكشف',
    items: ['explorers_amama', 'explorers_thobe', 'explorers_rida', 'explorers_belt', 'explorers_boots'],
    bonuses: {
      2: {
        hp: 15,
        mp: 15,
        description: '2-piece: +15 HP, +15 MP',
        descriptionArabic: 'قطعتان: +١٥ نقطة حياة، +١٥ نقطة سحر',
      },
      4: {
        hp: 40,
        mp: 40,
        damage: 0.05,
        defense: 0.05,
        description: '4-piece: +40 HP, +40 MP, +5% damage, +5% defense, increased exploration rewards',
        descriptionArabic: 'أربع قطع: +٤٠ نقطة حياة، +٤٠ نقطة سحر، +٥٪ ضرر، +٥٪ دفاع، مكافآت الاستكشاف متزايدة',
      },
    },
  },

  // ─── CRAFTED SETS (Phase 31) ───
  crafted_blacksmith_set: {
    name: "Blacksmith's Forged Arsenal",
    nameArabic: 'ترسانة الحداد المطروقة',
    items: ['crafted_blacksmith_steel_armor', 'crafted_blacksmith_gauntlets', 'crafted_blacksmith_greaves', 'crafted_blacksmith_shield', 'crafted_blacksmith_sword'],
    bonuses: {
      2: {
        defense: 0.10,
        description: '2-piece: +10% defense',
        descriptionArabic: 'قطعتان: +١٠٪ دفاع',
      },
      4: {
        defense: 0.20,
        damage: 0.15,
        description: '4-piece: +20% defense, +15% damage',
        descriptionArabic: 'أربع قطع: +٢٠٪ دفاع، +١٥٪ ضرر',
      },
    },
  },

  crafted_weaver_set: {
    name: "Weaver's Elegant Ensemble",
    nameArabic: 'مجموعة النساج الأنيقة',
    items: ['crafted_weaver_silk_robe', 'crafted_weaver_embroidered_cloak', 'crafted_weaver_sash', 'crafted_weaver_slippers', 'crafted_weaver_gloves', 'crafted_weaver_tapestry_cloak'],
    bonuses: {
      2: {
        mp: 25,
        description: '2-piece: +25 MP',
        descriptionArabic: 'قطعتان: +٢٥ نقطة سحر',
      },
      4: {
        mp: 60,
        defense: 0.08,
        description: '4-piece: +60 MP, +8% defense',
        descriptionArabic: 'أربع قطع: +٦٠ نقطة سحر، +٨٪ دفاع',
      },
    },
  },

  crafted_builder_set: {
    name: "Builder's Protective Gear",
    nameArabic: 'معدات البناء الواقية',
    items: ['crafted_builder_jade_ring', 'crafted_builder_lapis_pendant', 'crafted_builder_marble_belt', 'crafted_builder_stone_boots'],
    bonuses: {
      2: {
        hp: 30,
        defense: 0.05,
        description: '2-piece: +30 HP, +5% defense',
        descriptionArabic: 'قطعتان: +٣٠ نقطة حياة، +٥٪ دفاع',
      },
      4: {
        hp: 75,
        defense: 0.15,
        description: '4-piece: +75 HP, +15% defense',
        descriptionArabic: 'أربع قطع: +٧٥ نقطة حياة، +١٥٪ دفاع',
      },
    },
  },

  crafted_calligrapher_set: {
    name: "Calligrapher's Sacred Collection",
    nameArabic: 'مجموعة الخطاط المقدسة',
    items: ['crafted_calligrapher_blessed_ink_ring', 'crafted_calligrapher_manuscript_gloves', 'crafted_calligrapher_ink_vial_pendant', 'crafted_calligrapher_protection_talisman', 'crafted_calligrapher_manuscript_belt', 'crafted_calligrapher_divine_scroll'],
    bonuses: {
      2: {
        mp: 30,
        damage: 0.05,
        description: '2-piece: +30 MP, +5% spell damage',
        descriptionArabic: 'قطعتان: +٣٠ نقطة سحر، +٥٪ ضرر التعويذة',
      },
      4: {
        mp: 75,
        damage: 0.12,
        description: '4-piece: +75 MP, +12% spell damage',
        descriptionArabic: 'أربع قطع: +٧٥ نقطة سحر، +١٢٪ ضرر التعويذة',
      },
    },
  },

  crafted_cook_set: {
    name: "Cook's Nourishing Collection",
    nameArabic: 'مجموعة الطباخ المغذية',
    items: ['crafted_cook_preserved_honey', 'crafted_cook_saffron_pendant'],
    bonuses: {
      2: {
        hp: 40,
        mp: 25,
        description: '2-piece: +40 HP, +25 MP',
        descriptionArabic: 'قطعتان: +٤٠ نقطة حياة، +٢٥ نقطة سحر',
      },
    },
  },

  crafted_herbalist_set: {
    name: "Herbalist's Restorative Collection",
    nameArabic: 'مجموعة العطار العلاجية',
    items: ['crafted_herbalist_emerald_amulet', 'crafted_herbalist_phoenix_tears'],
    bonuses: {
      2: {
        hp: 50,
        defense: 0.08,
        description: '2-piece: +50 HP, +8% defense, enhanced healing effects',
        descriptionArabic: 'قطعتان: +٥٠ نقطة حياة، +٨٪ دفاع، تأثيرات الشفاء معززة',
      },
    },
  },
};

/**
 * Compute set bonuses based on equipped items
 * @param {Object} equippedItems - Object with slot keys and itemId values
 * @returns {Array} Array of active set bonuses: [{ setId, setName, pieces, bonus }]
 */
export function getSetBonus(equippedItems) {
  const equippedItemIds = Object.values(equippedItems).filter(Boolean); // Remove null slots
  const activeBonuses = [];

  // For each set, count how many equipped items belong to it
  for (const [setId, setData] of Object.entries(ITEM_SETS)) {
    const matchingPieces = equippedItemIds.filter(itemId =>
      setData.items.includes(itemId)
    ).length;

    if (matchingPieces === 0) continue;

    // Find which bonus thresholds are met (e.g., 2-piece, 4-piece)
    const bonusThresholds = Object.keys(setData.bonuses)
      .map(Number)
      .sort((a, b) => a - b);

    // Apply the highest threshold met
    for (let i = bonusThresholds.length - 1; i >= 0; i--) {
      const threshold = bonusThresholds[i];
      if (matchingPieces >= threshold) {
        activeBonuses.push({
          setId,
          setName: setData.name,
          setNameArabic: setData.nameArabic,
          pieces: matchingPieces,
          threshold,
          bonus: setData.bonuses[threshold],
        });
        break; // Only apply highest threshold
      }
    }
  }

  return activeBonuses;
}
