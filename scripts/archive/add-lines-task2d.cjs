/**
 * add-lines-task2d.cjs
 * Final batch to cross 1,543 lines.
 * Currently at 1495, need 48+ more.
 */
const fs = require('fs');
const path = require('path');

const npcsPath = path.resolve(__dirname, '../src/data/npcs.json');
let npcs = JSON.parse(fs.readFileSync(npcsPath, 'utf8'));

// Add a teaching return_visit tree to each of the remaining secondary NPCs
// dockmaster-nadia, carpet-seller-jamal, garden-keeper-leila, baker-yasmin,
// mountain-hermit-idris, stable-master-yara, astronomer-zain (4th trees now)
// Plus the 3 inner NPCs with only 13-15 lines.

// Also bolster wanderer-ali's return content since ali is among the main NPCs
// with moderate content. Add a 4th tree.

// dockmaster-nadia: final return tree on greetings
const nadia = npcs.find(n => n.id === 'dockmaster-nadia');
if (nadia) {
  nadia.dialogueTrees.push({
    id: 'topic_return_greetings_port',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: 'آخِر دَرس! كَيف تُحَيِّي البَحّارَة؟', english: 'Final lesson! How do you greet sailors?', transliteration: 'aakhir dars! kayf tuhayiii al-bahhaarah?' },
      { speaker: 'npc', arabic: 'مَرحَباً — أَصلُها "رَحب" أَي سَعَة وَفُسحَة — أَهلاً بِك', english: 'Marhaban — from rahb, meaning wide space — you are welcome here.', transliteration: 'marhaban — asluha "rahb" ay sa\'a wa fusha — ahlan bik', teachWord: 'salaam' },
      { speaker: 'player', choices: [{ arabic: 'مَرحَباً يا نادِيَة!', english: 'Marhaban, Nadia!', next: null }] }
    ]
  });
}

// carpet-seller-jamal: geometry vocabulary
const jamal = npcs.find(n => n.id === 'carpet-seller-jamal');
if (jamal) {
  jamal.dialogueTrees.push({
    id: 'topic_return_geometry',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: 'كُلّ سَجّادَة هِيَ رِياضِيّات! مَثَّلَث، مُرَبَّع، دائِرَة', english: 'Every carpet is mathematics! Triangle, square, circle.', transliteration: 'kull sajjaada hiya riyaadiyyaat! muthalath, murabba\', daa\'ira' },
      { speaker: 'npc', arabic: '"algebra" و"algorithm" مِن العَرَبِيَّة — العَرَب أَعطَونا الرِّياضِيّات الحَديثَة', english: '"Algebra" and "algorithm" come from Arabic — Arabs gave us modern mathematics.', transliteration: '"algebra" wa "algorithm" min al-arabiyya — al-arab a\'atawna ar-riyaadiyyaat al-hadiitha', teachWord: 'num_1' },
      { speaker: 'player', choices: [{ arabic: 'السَّجّاد وَالرِّياضِيّات! شُكراً', english: 'Carpets and math! Thank you.', next: null }] }
    ]
  });
}

// garden-keeper-leila: tree of knowledge
const leila = npcs.find(n => n.id === 'garden-keeper-leila');
if (leila) {
  leila.dialogueTrees.push({
    id: 'topic_return_knowledge',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: 'الحَديقَة تُعَلِّمُك الصَّبر — النَّباتات لا تَستَعجِل', english: 'The garden teaches patience — plants do not hurry.', transliteration: 'al-hadiqa tu\'allimuk as-sabr — an-nabaataat laa tasta\'jil' },
      { speaker: 'npc', arabic: 'قُل: "الطَّبيعَة جَميلَة" — أَربَع كَلِمات تَعلَّمتَها اليَوم', english: 'Say: "Nature is beautiful" — four words you learned today.', transliteration: 'qul: "at-tabi\'a jamiila" — arba\' kalimaat ta\'allamtaha al-yawm', teachWord: 'sun_w14' },
      { speaker: 'player', choices: [{ arabic: 'الطَّبيعَة جَميلَة! شُكراً لَيلى', english: 'Nature is beautiful! Thank you, Leila.', next: null }] }
    ]
  });
}

// baker-yasmin: bread and culture
const yasmin = npcs.find(n => n.id === 'baker-yasmin');
if (yasmin) {
  yasmin.dialogueTrees.push({
    id: 'topic_return_bread_culture',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: 'الخُبز في العَرَبِيَّة — "عَيْش" في مِصر — أَي "حَياة"', english: 'Bread in Egypt is called "aysh" — meaning "life".', transliteration: 'al-khubz fil-arabiyya — "\'aysh" fii misr — ay "hayaat"' },
      { speaker: 'npc', arabic: 'وَفي الخَليج "خُبز" — نَفس الجَذر لِلعَيش وَالحَياة', english: 'And in the Gulf "khubz" — the same root as \'aysh meaning life.', transliteration: 'wa fil-khalij "khubz" — nafs al-jadhr lil-\'aysh wal-hayaat', teachWord: 'bread_1' },
      { speaker: 'player', choices: [{ arabic: 'الخُبز حَياة! شُكراً ياسمين', english: 'Bread is life! Thank you, Yasmin.', next: null }] }
    ]
  });
}

// mountain-hermit-idris: meditation vocabulary
const idris = npcs.find(n => n.id === 'mountain-hermit-idris');
if (idris) {
  idris.dialogueTrees.push({
    id: 'topic_return_meditation',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: 'اِجلِس. خُذ نَفَساً. "تَفَكَّر" — العَقل يَحتاج الهُدوء', english: 'Sit. Take a breath. "Tafakkar" — the mind needs quiet.', transliteration: 'ijlis. khudh nafasan. "tafakkar" — al-\'aql yahtaaj al-huduu\'' },
      { speaker: 'npc', arabic: 'كَلِمَة "تَفَكَّر" تَعني التَّأَمُّل العَميق — فِكر عَميق', english: '"Tafakkar" means deep reflection — profound thought.', transliteration: 'kalima "tafakkar" ta\'nii at-ta\'ammul al-\'amiiq — fikr \'amiiq', teachWord: 'write_1' },
      { speaker: 'player', choices: [{ arabic: 'سَأَتَفَكَّر. شُكراً', english: 'I will reflect. Thank you.', next: null }] }
    ]
  });
}

// stable-master-yara: Arabic geography
const yara = npcs.find(n => n.id === 'stable-master-yara');
if (yara) {
  yara.dialogueTrees.push({
    id: 'topic_return_geography',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: '"الجَزيرَة العَرَبِيَّة" تَعني: الجَزيرَة — الأَرض المُحاطَة بِالماء', english: '"Al-Jazira al-Arabiyya" means: jazira — land surrounded by water (peninsula).', transliteration: '"al-jazira al-arabiyya" ta\'nii: al-jaziira — al-ard al-muhaata bil-maa\'' },
      { speaker: 'npc', arabic: '"الجَزيرَة" أَيضاً اِسم قَناة الأَخبار — مَعناها "الجَزيرَة"', english: '"Al-Jazeera" is also the news channel name — it means "The Island/Peninsula".', transliteration: '"al-jazeera" aydan ism qanaat al-akhbaar — ma\'naaha "al-jaziira"', teachWord: 'water_w13' },
      { speaker: 'player', choices: [{ arabic: 'الجَزيرَة! فَهِمتُ. شُكراً يارا', english: 'Al-Jazeera! I understand now. Thank you, Yara.', next: null }] }
    ]
  });
}

// astronomer-zain: time vocabulary
const zain = npcs.find(n => n.id === 'astronomer-zain');
if (zain) {
  zain.dialogueTrees.push({
    id: 'topic_return_time',
    trigger: 'return_visit',
    lines: [
      { speaker: 'npc', arabic: 'وَقت — هَذِهِ الكَلِمَة مُهِمَّة لِلفَلَكي', english: 'Waqt — time. This word is essential for the astronomer.', transliteration: 'waqt — haadhihi al-kalima muhimma lil-falakii', teachWord: 'day_1' },
      { speaker: 'npc', arabic: 'العَرَب قَسَّموا اللَّيل إلى سَاعات وَالسّاعَة إلى دَقائِق — قَبلَ أَوروبّا بِقُرون', english: 'Arabs divided the night into hours and the hour into minutes — centuries before Europe.', transliteration: 'al-arab qassamuu al-layl ilaa saa\'aat was-saa\'a ilaa daqaa\'iq — qabl urubbaa bi-quroon' },
      { speaker: 'player', choices: [{ arabic: 'الوَقت عِلم! شُكراً زَين', english: 'Time is a science! Thank you, Zain.', next: null }] }
    ]
  });
}

// Write the updated npcs.json
fs.writeFileSync(npcsPath, JSON.stringify(npcs, null, 2), 'utf8');
