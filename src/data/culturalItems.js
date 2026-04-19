/**
 * culturalItems.js — Cultural context quiz data
 * 25+ Arabic expressions/proverbs with situational matching
 *
 * Each item has:
 *   expression     — Arabic expression or proverb
 *   transliteration — Romanized pronunciation
 *   correctContext — The correct cultural situation/context
 *   options        — Array of 4 situation descriptions (one is correctContext)
 *   explanation    — Why this expression is used in that context
 */

export const CULTURAL_ITEMS = [
  {
    expression: 'بسم الله',
    transliteration: 'bismillah',
    correctContext: 'Said before starting any task or eating a meal',
    options: [
      'Said before starting any task or eating a meal',
      'Said when angry at someone',
      'Said when leaving a gathering',
      'Said when going to sleep',
    ],
    explanation: '"In the name of God" — Muslims say this before beginning any activity, especially eating, to invoke God\'s blessing.',
  },
  {
    expression: 'الحمد لله',
    transliteration: 'al-7amdu lillah',
    correctContext: 'Said to express gratitude or after completing something',
    options: [
      'Said to express gratitude or after completing something',
      'Said when greeting someone for the first time',
      'Said when asking for directions',
      'Said when apologizing for a mistake',
    ],
    explanation: '"Praise be to God" — used to express thankfulness after eating, recovering from illness, or receiving good news.',
  },
  {
    expression: 'إن شاء الله',
    transliteration: 'insha\'allah',
    correctContext: 'Said when talking about future plans or hopes',
    options: [
      'Said when talking about future plans or hopes',
      'Said when refusing an invitation politely',
      'Said when remembering the deceased',
      'Said when entering someone\'s home',
    ],
    explanation: '"God willing" — used when discussing anything in the future, expressing hope that God will allow it to happen.',
  },
  {
    expression: 'ما شاء الله',
    transliteration: 'masha\'allah',
    correctContext: 'Said to express admiration and ward off the evil eye',
    options: [
      'Said to express admiration and ward off the evil eye',
      'Said when disappointed in someone',
      'Said when ending a phone call',
      'Said when paying at a shop',
    ],
    explanation: '"What God has willed" — used when complimenting something beautiful or successful, to protect from envy.',
  },
  {
    expression: 'السلام عليكم',
    transliteration: 'as-salaamu 3alaykum',
    correctContext: 'The standard greeting when meeting someone',
    options: [
      'The standard greeting when meeting someone',
      'Said when leaving a room quietly',
      'Said when finishing a prayer',
      'Said when thanking a host for dinner',
    ],
    explanation: '"Peace be upon you" — the universal Islamic greeting used when meeting others, expected to be returned with "وعليكم السلام".',
  },
  {
    expression: 'تفضّل',
    transliteration: 'tafaddal',
    correctContext: 'Said when offering someone something or inviting them in',
    options: [
      'Said when offering someone something or inviting them in',
      'Said when refusing food politely',
      'Said when asking someone to be quiet',
      'Said when congratulating on a wedding',
    ],
    explanation: '"Please / go ahead" — a versatile hospitality word used when offering food, a seat, inviting someone to enter, or handing something over.',
  },
  {
    expression: 'يعطيك العافية',
    transliteration: 'ya3tiik al-3aafiya',
    correctContext: 'Said to someone who is working or has been working hard',
    options: [
      'Said to someone who is working or has been working hard',
      'Said when someone sneezes',
      'Said at a funeral',
      'Said when bargaining at a market',
    ],
    explanation: '"May God give you strength/health" — a common phrase to acknowledge someone\'s effort or hard work.',
  },
  {
    expression: 'عظّم الله أجرك',
    transliteration: '3aththam allah ajrak',
    correctContext: 'Said to someone who has lost a loved one (condolence)',
    options: [
      'Said to someone who has lost a loved one (condolence)',
      'Said when someone gets married',
      'Said when someone passes an exam',
      'Said when waking up in the morning',
    ],
    explanation: '"May God magnify your reward" — a traditional Arabic condolence phrase expressing sympathy for bereavement.',
  },
  {
    expression: 'مبروك',
    transliteration: 'mabruuk',
    correctContext: 'Said to congratulate someone on a happy occasion',
    options: [
      'Said to congratulate someone on a happy occasion',
      'Said when someone is sick',
      'Said when disagreeing with someone',
      'Said when entering a mosque',
    ],
    explanation: '"Congratulations / blessed" — used for weddings, births, graduations, new jobs, and any happy milestone.',
  },
  {
    expression: 'بالهناء والشفاء',
    transliteration: 'bil-hanaa\' wash-shifaa\'',
    correctContext: 'Said to someone after they finish eating',
    options: [
      'Said to someone after they finish eating',
      'Said when someone is about to travel',
      'Said when entering a new house',
      'Said before starting a race',
    ],
    explanation: '"With happiness and health" — a traditional phrase said after a meal, wishing the eater good health from the food.',
  },
  {
    expression: 'الله يرحمه',
    transliteration: 'allah yar7amu',
    correctContext: 'Said when mentioning someone who has passed away',
    options: [
      'Said when mentioning someone who has passed away',
      'Said when someone tells a joke',
      'Said when entering a market',
      'Said when receiving a gift',
    ],
    explanation: '"May God have mercy on him/her" — spoken whenever a deceased person is mentioned, as a prayer for their soul.',
  },
  {
    expression: 'على راسي',
    transliteration: '3ala raasi',
    correctContext: 'Said to show willingness to help or deep respect for a request',
    options: [
      'Said to show willingness to help or deep respect for a request',
      'Said when someone steps on your foot',
      'Said when ordering coffee',
      'Said when the weather is very hot',
    ],
    explanation: '"On my head" — an idiom meaning "I\'d be honored" or "absolutely, with great respect", showing complete willingness to fulfill a request.',
  },
  {
    expression: 'يرحم والديك',
    transliteration: 'yar7am waalidayk',
    correctContext: 'Said as a way of saying thank you or making a polite request',
    options: [
      'Said as a way of saying thank you or making a polite request',
      'Said when meeting someone\'s parents',
      'Said when a child misbehaves',
      'Said when visiting a graveyard',
    ],
    explanation: '"May God have mercy on your parents" — a respectful way to thank someone or soften a request, invoking blessings on their parents.',
  },
  {
    expression: 'صحتين',
    transliteration: 'sa7tein',
    correctContext: 'Said to someone who is about to eat or is eating',
    options: [
      'Said to someone who is about to eat or is eating',
      'Said when someone gets a haircut',
      'Said when leaving a hospital',
      'Said when the sun rises',
    ],
    explanation: '"Double health" — the Levantine equivalent of "bon appetit", wishing double health from the meal.',
  },
  {
    expression: 'نعيماً',
    transliteration: 'na3iiman',
    correctContext: 'Said to someone who just had a shower, haircut, or bath',
    options: [
      'Said to someone who just had a shower, haircut, or bath',
      'Said when someone buys a new car',
      'Said when it starts raining',
      'Said when someone finishes praying',
    ],
    explanation: '"Blessedness" — said after someone grooms themselves (shower, haircut, shave), wishing them comfort and blessedness.',
  },
  {
    expression: 'حياك الله',
    transliteration: '7ayyaak allah',
    correctContext: 'Said to warmly welcome someone',
    options: [
      'Said to warmly welcome someone',
      'Said when someone is about to die',
      'Said when closing a shop',
      'Said when refusing a second helping of food',
    ],
    explanation: '"May God greet/honor you" — a warm welcoming phrase, especially common in Gulf Arabic hospitality.',
  },
  {
    expression: 'بارك الله فيك',
    transliteration: 'baaraka allahu fiik',
    correctContext: 'Said to thank someone or pray for blessings upon them',
    options: [
      'Said to thank someone or pray for blessings upon them',
      'Said when scolding a child',
      'Said when negotiating a price',
      'Said when someone drops something',
    ],
    explanation: '"May God bless you" — a grateful prayer-phrase used to thank someone for a kindness or favor.',
  },
  {
    expression: 'يا حرام',
    transliteration: 'ya 7araam',
    correctContext: 'Said to express sympathy or pity for someone\'s misfortune',
    options: [
      'Said to express sympathy or pity for someone\'s misfortune',
      'Said when something is religiously forbidden',
      'Said when food is very spicy',
      'Said when celebrating a victory',
    ],
    explanation: '"Oh, how pitiful" — an expression of compassion and empathy, used when hearing about someone\'s hardship or bad luck.',
  },
  {
    expression: 'الله يشفيك',
    transliteration: 'allah yashfiik',
    correctContext: 'Said to someone who is sick, wishing them recovery',
    options: [
      'Said to someone who is sick, wishing them recovery',
      'Said when someone gets promoted',
      'Said before a long journey',
      'Said when entering a library',
    ],
    explanation: '"May God heal you" — a caring prayer said to anyone who is ill, injured, or unwell.',
  },
  {
    expression: 'اللي فات مات',
    transliteration: 'illi faat maat',
    correctContext: 'Said to advise someone to let go of the past and move on',
    options: [
      'Said to advise someone to let go of the past and move on',
      'Said when someone arrives too late for dinner',
      'Said at the beginning of Ramadan',
      'Said when a shop runs out of stock',
    ],
    explanation: '"What has passed has died" — an Arabic proverb meaning "let bygones be bygones", encouraging people to focus on the present.',
  },
  {
    expression: 'يد واحدة ما تصفّق',
    transliteration: 'yad wa7da maa tsaffiq',
    correctContext: 'Said to emphasize that cooperation and teamwork are needed',
    options: [
      'Said to emphasize that cooperation and teamwork are needed',
      'Said when someone claps at the wrong time',
      'Said when a musician plays badly',
      'Said when asking someone to stop making noise',
    ],
    explanation: '"One hand doesn\'t clap" — an Arabic proverb equivalent to "it takes two to tango", stressing the need for collaboration.',
  },
  {
    expression: 'القرد في عين أمه غزال',
    transliteration: 'al-qird fi 3ein ummu ghazaal',
    correctContext: 'Said to describe how parents see their children as perfect no matter what',
    options: [
      'Said to describe how parents see their children as perfect no matter what',
      'Said when visiting a zoo',
      'Said when a child is very beautiful',
      'Said when comparing two animals',
    ],
    explanation: '"A monkey in his mother\'s eye is a gazelle" — means parents always see beauty in their children, similar to "beauty is in the eye of the beholder".',
  },
  {
    expression: 'الصبر مفتاح الفرج',
    transliteration: 'as-sabr miftaa7 al-faraj',
    correctContext: 'Said to encourage someone going through difficulties to be patient',
    options: [
      'Said to encourage someone going through difficulties to be patient',
      'Said when someone finds a key',
      'Said when opening a new business',
      'Said when the door is locked',
    ],
    explanation: '"Patience is the key to relief" — a beloved Arabic proverb encouraging perseverance during hardship.',
  },
  {
    expression: 'دار لقمان الحكيم',
    transliteration: 'daar luqmaan al-7akiim',
    correctContext: 'Said to describe a place or situation that never changes',
    options: [
      'Said to describe a place or situation that never changes',
      'Said when visiting a wise old man',
      'Said when entering a pharmacy',
      'Said when reading a history book',
    ],
    explanation: '"The house of Luqman the Wise" — refers to something unchanging and stagnant, from the story of the sage Luqman.',
  },
  {
    expression: 'عقبال عندك',
    transliteration: '3uqbaal 3indak',
    correctContext: 'Said to wish someone the same good fortune you are celebrating',
    options: [
      'Said to wish someone the same good fortune you are celebrating',
      'Said when someone returns borrowed money',
      'Said when someone is older than you',
      'Said when visiting a new neighbor',
    ],
    explanation: '"May it be your turn next" — said at celebrations (weddings, graduations) to wish the same joy upon the listener.',
  },
  {
    expression: 'توكّلنا على الله',
    transliteration: 'tawakkalna 3ala allah',
    correctContext: 'Said when starting a journey or embarking on an important decision',
    options: [
      'Said when starting a journey or embarking on an important decision',
      'Said when losing a game',
      'Said when waking up from a nightmare',
      'Said when counting money',
    ],
    explanation: '"We place our trust in God" — said when setting out on a trip or beginning something significant, entrusting the outcome to God.',
  },
];
