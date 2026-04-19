/**
 * add-lines-task2e.cjs
 * Final 27+ lines to cross 1,543 target.
 */
const fs = require('fs');
const path = require('path');
const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// student-khalid: add a return_visit review tree
const khalid = npcs.find(n => n.id === 'student-khalid');
if (khalid) {
  khalid.dialogueTrees.push({
    id: 'khalid_review',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'أَنا تَعَلَّمتُ دَرساً جَديداً اليَوم! تَعال نَتَذاكَر',
        english: "I learned a new lesson today! Come, let's review together.",
        transliteration: "ana ta'allamtu darsan jadiidan al-yawm! ta'aal natadhaakar"
      },
      {
        speaker: 'npc',
        arabic: 'أُستاذ يوسُف قال: المُراجَعَة أُمّ العِلم — ما رَأيُك؟',
        english: "Teacher Yusuf said: 'Review is the mother of knowledge' — what do you think?",
        transliteration: "ustaadh yuusuf qaal: al-muraaja'a umm al-'ilm — maa ra'yuk?",
        teachWord: 'write_1'
      },
      {
        speaker: 'npc',
        arabic: 'أَنا كَثيراً ما أَنسى — لَكِن التَّكرار يُساعِد كَثيراً',
        english: 'I often forget — but repetition helps a great deal.',
        transliteration: "ana kathiiran maa ansaa — laakin at-tikraar yusaa'id kathiiran"
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'لِنَتَذاكَر سَوِيَّاً!', english: "Let's review together!", next: null }]
      }
    ]
  });
  console.log('Added khalid_review tree');
}

// guard-hamza: add return_visit city wall tree
const hamza = npcs.find(n => n.id === 'guard-hamza');
if (hamza) {
  hamza.dialogueTrees.push({
    id: 'hamza_city_walls',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'المَدينَة مَحمِيَّة بِالأَسوار. تَعال أُريكَ',
        english: 'The city is protected by walls. Come, let me show you.',
        transliteration: "al-madiina mahmiyya bil-aswaar. ta'aal uriika"
      },
      {
        speaker: 'npc',
        arabic: 'سور — الحائِط حَول المَدينَة. مِنهُ مَدينَة الصِّلاة السُّور في القُرآن',
        english: 'Suur — the wall around a city. Also the name for Quran chapters (Sura).',
        transliteration: 'suur — al-haa\'it hawla al-madiina. minhu madiina',
        teachWord: 'p_0407',
        culturalNote: 'The Arabic word "sura" (سورة), a Quran chapter, shares its root with "suur" (سور, wall). A sura is a section that stands complete on its own — like a walled enclosure that contains and protects what is within it.'
      },
      {
        speaker: 'npc',
        arabic: 'أَلف حارِس حَرَسوا بَغداد في ذُروَتِها — أَعظَم مَدينَة في العالَم',
        english: 'A thousand guards protected Baghdad at its peak — the greatest city in the world.',
        transliteration: 'alf haaris harasuu baghdaad fii dhurwatihaa — a\'zam madiina fil-\'aalam'
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'حِماية المَدينَة مُهِمَّة! شُكراً حَمزَة', english: 'Protecting the city is important! Thank you, Hamza.', next: null }]
      }
    ]
  });
  console.log('Added hamza_city_walls tree');
}

// vizier-abbas: add return_visit justice vocabulary
const abbas = npcs.find(n => n.id === 'vizier-abbas');
if (abbas) {
  abbas.dialogueTrees.push({
    id: 'abbas_justice',
    trigger: 'return_visit',
    lines: [
      {
        speaker: 'npc',
        arabic: 'العَدلُ أَساسُ المُلك — هَذا مَبدَأ الحُكم',
        english: 'Justice is the foundation of rule — this is the principle of governance.',
        transliteration: "al-'adl asaas al-mulk — haadha mabda' al-hukm"
      },
      {
        speaker: 'npc',
        arabic: 'قاضٍ — القاضي يَحكُم بِالعَدل. وَكَلِمَة "cadi" الإنجليزِيَّة مِنها',
        english: 'Qaadi — the judge rules with justice. The English "cadi" comes from this word.',
        transliteration: "qaadin — al-qaadi yahkum bil-'adl",
        teachWord: 'right_1'
      },
      {
        speaker: 'npc',
        arabic: 'في بَغداد العَبّاسِيَّة كانَ القُضاة مُستَقِلِّين — نِظام قانوني عَادِل',
        english: 'In Abbasid Baghdad, judges were independent — a fair legal system.',
        transliteration: "fii baghdaad al-'abbaasiyya kaana al-qudaat mustaqilliin"
      },
      {
        speaker: 'player',
        choices: [{ arabic: 'العَدل قَبلَ كُلّ شَيء! شُكراً وَزير', english: 'Justice above all! Thank you, vizier.', next: null }]
      }
    ]
  });
  console.log('Added abbas_justice tree');
}

fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
console.log('\nDone! Final lines added.');
