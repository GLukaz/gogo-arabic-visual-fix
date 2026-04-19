// inscription-oasis.ink
// Vocabulary-gated comprehension for Oasis Village inscription (Zone 1, A1)
// Root: s-l-m (peace/submission) — wordIds: greetings_001, salaam_1, knowledge_1, journey_1
// ENVR-02: Full / Partial / None comprehension tiers based on vocab mastery

EXTERNAL getVocabMastery(wordId)
EXTERNAL addFsrsCardFromInk(wordId, source)

VAR knows_greeting = 0
VAR knows_salaam = 0
VAR knows_knowledge = 0
VAR knows_journey = 0
VAR comprehension_score = 0

-> check_vocab

=== check_vocab ===
~ knows_greeting = getVocabMastery("greetings_001")
~ knows_salaam = getVocabMastery("salaam_1")
~ knows_knowledge = getVocabMastery("knowledge_1")
~ knows_journey = getVocabMastery("journey_1")
~ comprehension_score = knows_greeting + knows_salaam + knows_knowledge + knows_journey
{comprehension_score >= 3:
    -> tier_full
}
{comprehension_score >= 1 && comprehension_score < 3:
    -> tier_partial
}
-> tier_none

=== tier_full ===
(The inscription reads clearly — you understand each word.)
* [Peace be upon you, people of the oasis.]
    You translate with ease. The root س-ل-م gives peace, Islam, and safety.
    ~ addFsrsCardFromInk("greetings_001", "inscription_oasis_review")
    ~ addFsrsCardFromInk("salaam_1", "inscription_oasis_review")
    -> END
* [Here begins the journey of knowledge.]
    You grasped the heart of the inscription.
    ~ addFsrsCardFromInk("knowledge_1", "inscription_oasis_review")
    ~ addFsrsCardFromInk("journey_1", "inscription_oasis_review")
    -> END

=== tier_partial ===
(You recognise a few words — the rest is still unclear.)
* [I can make out "salaam" and "oasis".]
    Al-salaam means peace and al-waaha means oasis.
    ~ addFsrsCardFromInk("salaam_1", "inscription_oasis_partial")
    ~ addFsrsCardFromInk("knowledge_1", "inscription_oasis_partial")
    -> END
* [I see the word for "journey".]
    Al-rihla means journey — rihla al-marifa — the journey of knowledge.
    ~ addFsrsCardFromInk("journey_1", "inscription_oasis_partial")
    ~ addFsrsCardFromInk("greetings_001", "inscription_oasis_partial")
    -> END

=== tier_none ===
(This inscription uses the root س-ل-م. Most of it is beyond you for now, but you sense its welcoming tone.)
* [What does it mean?]
    "Peace be upon you, people of the oasis. Here begins the journey of knowledge."
    The root س-ل-م gives salaam (peace) and salama (safety).
    ~ addFsrsCardFromInk("salaam_1", "inscription_oasis_intro")
    ~ addFsrsCardFromInk("greetings_001", "inscription_oasis_intro")
    -> END
* [I'll study more Arabic first.]
    Good idea. Study first, then return.
    ~ addFsrsCardFromInk("knowledge_1", "inscription_oasis_intro")
    -> END
