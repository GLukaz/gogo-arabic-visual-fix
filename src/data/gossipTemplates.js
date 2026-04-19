/**
 * gossipTemplates.js — 10 gossip templates for quest completions
 *
 * Each template maps a quest ID to an Arabic gossip line with:
 * - arabicLine: Natural Arabic sentence an NPC says about the player's deed
 * - englishHint: English translation/hint for the player
 * - grammarNote: Pedagogical grammar annotation (past tense verbs, proper nouns)
 *
 * GOSP-05: Grammar notes teach narrative Arabic in context
 */

export const GOSSIP_TEMPLATES = {
  // Main quest acts
  'scholars_words_of_oasis': {
    topic: 'quest_words_of_oasis_complete',
    arabicLine: 'سَمِعتُ أنَّكَ أتمَمتَ مُهِمَّةً في الواحَة!',
    englishHint: 'I heard you completed a mission in the oasis!',
    grammarNote: 'Past tense verb: سَمِعتُ (sami\'tu) — I heard. أتمَمتَ (atamamta) — you completed.',
  },
  'scholars_library_secrets': {
    topic: 'quest_library_secrets_complete',
    arabicLine: 'يَقولونَ إنَّكَ وَجَدتَ مَخطوطَةً قَديمَة!',
    englishHint: 'They say you found an ancient manuscript!',
    grammarNote: 'Past tense verb: وَجَدتَ (wajadta) — you found. يَقولونَ (yaquuluna) — they say.',
  },
  'market_trade_routes': {
    topic: 'quest_market_trade_complete',
    arabicLine: 'التُّجَّارُ يَتَحَدَّثونَ عَن نَجاحِكَ في السوق.',
    englishHint: 'The merchants are talking about your success in the market.',
    grammarNote: 'Proper noun: التُّجَّارُ (at-tujjaaru) — the merchants. نَجاحِكَ (najaahika) — your success.',
  },
  'explore_desert_crossing': {
    topic: 'quest_desert_crossing_complete',
    arabicLine: 'بَلَغَني أنَّكَ عَبَرتَ الصَّحراءَ وَحدَكَ!',
    englishHint: 'It reached me that you crossed the desert alone!',
    grammarNote: 'Past tense: بَلَغَني (balaghani) — it reached me. عَبَرتَ (abarta) — you crossed.',
  },
  'guard_palace_defense': {
    topic: 'quest_palace_defense_complete',
    arabicLine: 'الحُرَّاسُ يَذكُرونَ شَجاعَتَكَ في الدِّفاع.',
    englishHint: 'The guards mention your bravery in the defense.',
    grammarNote: 'شَجاعَتَكَ (shajaa\'ataka) — your bravery. يَذكُرونَ (yadhkuruuna) — they mention.',
  },
  'craft_masterwork': {
    topic: 'quest_craft_masterwork_complete',
    arabicLine: 'الحِرَفِيّونَ مُعجَبونَ بِعَمَلِكَ الماهِر!',
    englishHint: 'The artisans are impressed by your skilled work!',
    grammarNote: 'مُعجَبونَ (mu\'jabuuna) — impressed. بِعَمَلِكَ (bi-\'amalika) — by your work.',
  },
  'poetry_verse_battle': {
    topic: 'quest_poetry_battle_complete',
    arabicLine: 'قَصيدَتُكَ أصبَحَت حَديثَ المَجلِس!',
    englishHint: 'Your poem has become the talk of the gathering!',
    grammarNote: 'أصبَحَت (asbahat) — became. حَديثَ المَجلِس (hadiitha al-majlis) — talk of the gathering.',
  },
  'explore_mountain_pass': {
    topic: 'quest_mountain_pass_complete',
    arabicLine: 'سَمِعتُ أنَّكَ وَصَلتَ إلى قِمَّةِ الجَبَل!',
    englishHint: 'I heard you reached the mountain summit!',
    grammarNote: 'Past tense: وَصَلتَ (wasalta) — you reached. قِمَّةِ (qimmati) — summit.',
  },
  'coastal_sea_voyage': {
    topic: 'quest_coastal_voyage_complete',
    arabicLine: 'البَحَّارَةُ يَروونَ قِصَّةَ رِحلَتِكَ البَحرِيَّة.',
    englishHint: 'The sailors tell the story of your sea voyage.',
    grammarNote: 'البَحَّارَةُ (al-bahhaara) — the sailors. يَروونَ (yarwuuna) — they narrate.',
  },
  'farmland_harvest': {
    topic: 'quest_farmland_harvest_complete',
    arabicLine: 'المُزارِعونَ شاكِرونَ لِمُساعَدَتِكَ في الحَصاد.',
    englishHint: 'The farmers are grateful for your help in the harvest.',
    grammarNote: 'شاكِرونَ (shaakiruuna) — grateful. الحَصاد (al-hasaad) — the harvest.',
  },
};
