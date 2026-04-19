/**
 * professions.js — Crafting profession definitions for Phase 31
 *
 * Defines 6 professions with Arabic names, skill trees, and progression.
 * Each profession has 10 levels and unlocks recipes/skills at each level.
 */

/**
 * PROFESSIONS — Flat object keyed by profession ID for O(1) lookup
 */
export const PROFESSIONS = {
  calligrapher: {
    id: 'calligrapher',
    nameArabic: 'خطاط',
    nameEnglish: 'Calligrapher',
    descriptionArabic: 'فن الخط العربي الجميل والكتابة الساحرة',
    descriptionEnglish: 'The art of beautiful Arabic calligraphy and enchanted writing',
    maxLevel: 10,
    xpPerLevel: 100,
    category: 'enchantment',
    teachableBy: 'calligraphy_master', // NPC ID
    skills: [
      { level: 1, nameArabic: 'الخط الأساسي', nameEnglish: 'Basic Script' },
      { level: 2, nameArabic: 'الحبر السحري', nameEnglish: 'Magical Ink' },
      { level: 3, nameArabic: 'النقش المزخرف', nameEnglish: 'Ornamental Inscription' },
      { level: 4, nameArabic: 'خط النسخ', nameEnglish: 'Naskh Script' },
      { level: 5, nameArabic: 'خط الثلث', nameEnglish: 'Thuluth Script' },
      { level: 6, nameArabic: 'التذهيب', nameEnglish: 'Illumination' },
      { level: 7, nameArabic: 'الختم المسحور', nameEnglish: 'Enchanted Seal' },
      { level: 8, nameArabic: 'خط الديواني', nameEnglish: 'Diwani Script' },
      { level: 9, nameArabic: 'الطلسم القديم', nameEnglish: 'Ancient Talisman' },
      { level: 10, nameArabic: 'الخط الأسطوري', nameEnglish: 'Legendary Calligraphy' },
    ],
  },

  cook: {
    id: 'cook',
    nameArabic: 'طباخ',
    nameEnglish: 'Cook',
    descriptionArabic: 'طهي الأطعمة الشهية والمأكولات المفيدة',
    descriptionEnglish: 'Cooking delicious foods and beneficial meals',
    maxLevel: 10,
    xpPerLevel: 100,
    category: 'food',
    teachableBy: 'tavern_keeper',
    skills: [
      { level: 1, nameArabic: 'الطبخ الأساسي', nameEnglish: 'Basic Cooking' },
      { level: 2, nameArabic: 'الخبز والحلويات', nameEnglish: 'Breads and Sweets' },
      { level: 3, nameArabic: 'التوابل العطرية', nameEnglish: 'Aromatic Spices' },
      { level: 4, nameArabic: 'الطبخ بالعسل', nameEnglish: 'Honey Cooking' },
      { level: 5, nameArabic: 'المخللات والمربى', nameEnglish: 'Pickles and Preserves' },
      { level: 6, nameArabic: 'الأطباق الملكية', nameEnglish: 'Royal Dishes' },
      { level: 7, nameArabic: 'طبخ الأعشاب الطبية', nameEnglish: 'Medicinal Cooking' },
      { level: 8, nameArabic: 'الحلويات الفاخرة', nameEnglish: 'Luxury Confections' },
      { level: 9, nameArabic: 'طعام البطل', nameEnglish: 'Hero\'s Feast' },
      { level: 10, nameArabic: 'الطبخ الأسطوري', nameEnglish: 'Legendary Cuisine' },
    ],
  },

  blacksmith: {
    id: 'blacksmith',
    nameArabic: 'حداد',
    nameEnglish: 'Blacksmith',
    descriptionArabic: 'صياغة الأسلحة والدروع من المعادن',
    descriptionEnglish: 'Forging weapons and armor from metals',
    maxLevel: 10,
    xpPerLevel: 100,
    category: 'forging',
    teachableBy: 'blacksmith_aziz',
    skills: [
      { level: 1, nameArabic: 'السبك الأساسي', nameEnglish: 'Basic Forging' },
      { level: 2, nameArabic: 'صهر الحديد', nameEnglish: 'Iron Smelting' },
      { level: 3, nameArabic: 'شحذ الشفرات', nameEnglish: 'Blade Sharpening' },
      { level: 4, nameArabic: 'سبك النحاس', nameEnglish: 'Bronze Forging' },
      { level: 5, nameArabic: 'تقوية الدروع', nameEnglish: 'Armor Reinforcement' },
      { level: 6, nameArabic: 'صياغة الفضة', nameEnglish: 'Silver Crafting' },
      { level: 7, nameArabic: 'السلاح المسحور', nameEnglish: 'Enchanted Weaponry' },
      { level: 8, nameArabic: 'الفولاذ الدمشقي', nameEnglish: 'Damascus Steel' },
      { level: 9, nameArabic: 'سبك الميثريل', nameEnglish: 'Mithril Forging' },
      { level: 10, nameArabic: 'الحدادة الأسطورية', nameEnglish: 'Legendary Smithing' },
    ],
  },

  herbalist: {
    id: 'herbalist',
    nameArabic: 'عطار',
    nameEnglish: 'Herbalist',
    descriptionArabic: 'جمع الأعشاب وصناعة الجرعات الشفائية',
    descriptionEnglish: 'Gathering herbs and crafting healing potions',
    maxLevel: 10,
    xpPerLevel: 100,
    category: 'alchemy',
    teachableBy: 'healer_layla',
    skills: [
      { level: 1, nameArabic: 'جمع الأعشاب', nameEnglish: 'Herb Gathering' },
      { level: 2, nameArabic: 'الجرعة البسيطة', nameEnglish: 'Simple Potion' },
      { level: 3, nameArabic: 'استخلاص الزيوت', nameEnglish: 'Oil Extraction' },
      { level: 4, nameArabic: 'ماء الورد', nameEnglish: 'Rosewater Distillation' },
      { level: 5, nameArabic: 'الترياق القوي', nameEnglish: 'Potent Antidote' },
      { level: 6, nameArabic: 'إكسير الطاقة', nameEnglish: 'Energy Elixir' },
      { level: 7, nameArabic: 'الجرعة السحرية', nameEnglish: 'Magical Brew' },
      { level: 8, nameArabic: 'الإكسير النادر', nameEnglish: 'Rare Elixir' },
      { level: 9, nameArabic: 'جرعة الخلود', nameEnglish: 'Elixir of Longevity' },
      { level: 10, nameArabic: 'العطارة الأسطورية', nameEnglish: 'Legendary Herbalism' },
    ],
  },

  weaver: {
    id: 'weaver',
    nameArabic: 'نساج',
    nameEnglish: 'Weaver',
    descriptionArabic: 'نسج الأقمشة الفاخرة والثياب الساحرة',
    descriptionEnglish: 'Weaving fine fabrics and enchanted garments',
    maxLevel: 10,
    xpPerLevel: 100,
    category: 'textiles',
    teachableBy: 'silk_merchant',
    skills: [
      { level: 1, nameArabic: 'النسيج الأساسي', nameEnglish: 'Basic Weaving' },
      { level: 2, nameArabic: 'غزل القطن', nameEnglish: 'Cotton Spinning' },
      { level: 3, nameArabic: 'نسج الصوف', nameEnglish: 'Wool Weaving' },
      { level: 4, nameArabic: 'التطريز الجميل', nameEnglish: 'Fine Embroidery' },
      { level: 5, nameArabic: 'صبغ الأقمشة', nameEnglish: 'Fabric Dyeing' },
      { level: 6, nameArabic: 'نسج الحرير', nameEnglish: 'Silk Weaving' },
      { level: 7, nameArabic: 'الثوب المسحور', nameEnglish: 'Enchanted Garment' },
      { level: 8, nameArabic: 'الديباج الفاخر', nameEnglish: 'Luxury Brocade' },
      { level: 9, nameArabic: 'نسج النجوم', nameEnglish: 'Starweave' },
      { level: 10, nameArabic: 'النسيج الأسطوري', nameEnglish: 'Legendary Weaving' },
    ],
  },

  builder: {
    id: 'builder',
    nameArabic: 'بناء',
    nameEnglish: 'Builder',
    descriptionArabic: 'بناء المباني والهياكل المعمارية',
    descriptionEnglish: 'Constructing buildings and architectural structures',
    maxLevel: 10,
    xpPerLevel: 100,
    category: 'construction',
    teachableBy: 'architect_omar',
    skills: [
      { level: 1, nameArabic: 'البناء الأساسي', nameEnglish: 'Basic Construction' },
      { level: 2, nameArabic: 'قطع الحجارة', nameEnglish: 'Stone Cutting' },
      { level: 3, nameArabic: 'الجدران القوية', nameEnglish: 'Strong Walls' },
      { level: 4, nameArabic: 'القباب والأقواس', nameEnglish: 'Domes and Arches' },
      { level: 5, nameArabic: 'الفسيفساء', nameEnglish: 'Mosaic Art' },
      { level: 6, nameArabic: 'المئذنة العالية', nameEnglish: 'Tall Minaret' },
      { level: 7, nameArabic: 'البناء المسحور', nameEnglish: 'Enchanted Construction' },
      { level: 8, nameArabic: 'العمارة الأندلسية', nameEnglish: 'Andalusian Architecture' },
      { level: 9, nameArabic: 'القصر الملكي', nameEnglish: 'Royal Palace' },
      { level: 10, nameArabic: 'البناء الأسطوري', nameEnglish: 'Legendary Architecture' },
    ],
  },
};

/**
 * PROFESSION_KEYS — Array of all profession IDs for iteration
 */
export const PROFESSION_KEYS = Object.keys(PROFESSIONS);
