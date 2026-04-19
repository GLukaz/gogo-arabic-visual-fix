// inscription-palace.ink
// Vocabulary-gated comprehension for Royal Palace inscription (Zone 8, B2)
// Root: h-k-m (ruling/wisdom) — wordIds: big_1, old_1, brave_1, tall_1
// ENVR-02: Full / Partial / None comprehension tiers based on vocab mastery

EXTERNAL getVocabMastery(wordId)
EXTERNAL addFsrsCardFromInk(wordId, source)

VAR knows_big = 0
VAR knows_old = 0
VAR knows_brave = 0
VAR knows_tall = 0
VAR comprehension_score = 0

-> check_vocab

=== check_vocab ===
~ knows_big = getVocabMastery("big_1")
~ knows_old = getVocabMastery("old_1")
~ knows_brave = getVocabMastery("brave_1")
~ knows_tall = getVocabMastery("tall_1")
~ comprehension_score = knows_big + knows_old + knows_brave + knows_tall
{comprehension_score >= 3:
    -> tier_full
}
{comprehension_score >= 1 && comprehension_score < 3:
    -> tier_partial
}
-> tier_none

=== tier_full ===
(The palace inscription reads clearly — you understand the philosophy of just rule.)
* ["Ruling with justice is the balance of the kingdom."]
    Al-hukm — ruling. Al-adl — justice. Al-mizan — the balance/scales.
    From the root ح-ك-م: hakama — to rule, hakim — ruler, hakim — wise one.
    ~ addFsrsCardFromInk("big_1", "inscription_palace_review")
    ~ addFsrsCardFromInk("brave_1", "inscription_palace_review")
    -> END
* ["The ruler is the servant of the people, not their master."]
    Al-hakim khadim — the ruler is a servant. A foundational principle of just governance.
    ~ addFsrsCardFromInk("old_1", "inscription_palace_review")
    ~ addFsrsCardFromInk("tall_1", "inscription_palace_review")
    -> END

=== tier_partial ===
(You can parse the weight of this text — al-hakim... al-adl... a royal decree of some kind.)
* [I recognise "justice" — al-adl.]
    Al-adl — justice. Root ع-د-ل: to be just, just one, justice system.
    ~ addFsrsCardFromInk("brave_1", "inscription_palace_partial")
    ~ addFsrsCardFromInk("old_1", "inscription_palace_partial")
    -> END
* [I see "ruler" — al-hakim.]
    Al-hakim from root ح-ك-م — same root as hakim (wise) and hikma (wisdom).
    ~ addFsrsCardFromInk("big_1", "inscription_palace_partial")
    ~ addFsrsCardFromInk("tall_1", "inscription_palace_partial")
    -> END

=== tier_none ===
(This inscription is inlaid with gold above the throne — it carries the full weight of royal authority.)
* [What does this royal inscription say?]
    "Ruling with justice is the balance of the kingdom. The ruler is the servant of the people, not their master."
    The root ح-ك-م gives hukm — rule, hakim — ruler, and hikma — wisdom.
    ~ addFsrsCardFromInk("big_1", "inscription_palace_intro")
    ~ addFsrsCardFromInk("brave_1", "inscription_palace_intro")
    -> END
* [These words are beyond me for now.]
    Humility is a virtue. Return when you are ready.
    ~ addFsrsCardFromInk("old_1", "inscription_palace_intro")
    ~ addFsrsCardFromInk("tall_1", "inscription_palace_intro")
    -> END
