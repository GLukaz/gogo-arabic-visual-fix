// inscription-library.ink
// Vocabulary-gated comprehension for Ancient Library inscription (Zone 2, A1-A2)
// Root: q-r-a (reading) — wordIds: read_1, know_1, learn_1, understand_1
// ENVR-02: Full / Partial / None comprehension tiers based on vocab mastery

EXTERNAL getVocabMastery(wordId)
EXTERNAL addFsrsCardFromInk(wordId, source)

VAR knows_read = 0
VAR knows_know = 0
VAR knows_learn = 0
VAR knows_understand = 0
VAR comprehension_score = 0

-> check_vocab

=== check_vocab ===
~ knows_read = getVocabMastery("read_1")
~ knows_know = getVocabMastery("know_1")
~ knows_learn = getVocabMastery("learn_1")
~ knows_understand = getVocabMastery("understand_1")
~ comprehension_score = knows_read + knows_know + knows_learn + knows_understand
{comprehension_score >= 3:
    -> tier_full
}
{comprehension_score >= 1 && comprehension_score < 3:
    -> tier_partial
}
-> tier_none

=== tier_full ===
(You read the inscription with confidence — every word comes alive.)
* ["Read in the name of your Lord who created."]
    This is the first command in the Quran: "Iqra!" — from the root ق-ر-أ.
    ~ addFsrsCardFromInk("read_1", "inscription_library_review")
    ~ addFsrsCardFromInk("know_1", "inscription_library_review")
    -> END
* ["Knowledge is light and ignorance is darkness."]
    Al-ilm — knowledge is light. Al-jahl — ignorance is darkness. You grasped it perfectly.
    ~ addFsrsCardFromInk("learn_1", "inscription_library_review")
    ~ addFsrsCardFromInk("understand_1", "inscription_library_review")
    -> END

=== tier_partial ===
(You catch a few familiar words — al-ilm, nur... the rest is still forming.)
* [I recognise "ilm" — knowledge.]
    Al-ilm means knowledge. From root ع-ل-م: to know, to teach, scholar.
    ~ addFsrsCardFromInk("know_1", "inscription_library_partial")
    ~ addFsrsCardFromInk("learn_1", "inscription_library_partial")
    -> END
* [I see "read" — iqra.]
    Excellent! Iqra — read! The root ق-ر-أ is the origin of the word "Quran" — the recitation.
    ~ addFsrsCardFromInk("read_1", "inscription_library_partial")
    ~ addFsrsCardFromInk("understand_1", "inscription_library_partial")
    -> END

=== tier_none ===
(The inscription is carved deeply — you can feel its importance, but the words are still foreign.)
* [What does this say?]
    "Read in the name of your Lord who created. Knowledge is light and ignorance is darkness."
    The first word — iqra — means Read! It was the first word revealed in the Quran.
    ~ addFsrsCardFromInk("read_1", "inscription_library_intro")
    ~ addFsrsCardFromInk("know_1", "inscription_library_intro")
    -> END
* [I'll come back when I know more.]
    Knowledge needs time.
    ~ addFsrsCardFromInk("learn_1", "inscription_library_intro")
    -> END
