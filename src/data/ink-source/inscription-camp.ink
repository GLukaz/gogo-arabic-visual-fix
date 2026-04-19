// inscription-camp.ink
// Vocabulary-gated comprehension for Bedouin Camp inscription (Zone 5, B1)
// Root: s-f-r (travel/journey) — wordIds: star_w16, moon_w15, desert_w18, camel_1
// ENVR-02: Full / Partial / None comprehension tiers based on vocab mastery

EXTERNAL getVocabMastery(wordId)
EXTERNAL addFsrsCardFromInk(wordId, source)

VAR knows_star = 0
VAR knows_moon = 0
VAR knows_desert = 0
VAR knows_camel = 0
VAR comprehension_score = 0

-> check_vocab

=== check_vocab ===
~ knows_star = getVocabMastery("star_w16")
~ knows_moon = getVocabMastery("moon_w15")
~ knows_desert = getVocabMastery("desert_w18")
~ knows_camel = getVocabMastery("camel_1")
~ comprehension_score = knows_star + knows_moon + knows_desert + knows_camel
{comprehension_score >= 3:
    -> tier_full
}
{comprehension_score >= 1 && comprehension_score < 3:
    -> tier_partial
}
-> tier_none

=== tier_full ===
(The words of a desert traveller — you understand every image carved here.)
* ["We travelled across the desert land and found the way by the stars."]
    Safarna — we travelled. Al-sahra' — the desert. Al-nujum — the stars.
    The Bedouin navigated by Polaris — al-Qutb — for centuries across the sands.
    ~ addFsrsCardFromInk("star_w16", "inscription_camp_review")
    ~ addFsrsCardFromInk("desert_w18", "inscription_camp_review")
    -> END
* ["Travel teaches wisdom."]
    Al-safar yuallimu al-hikma. Root س-ف-ر: safar, musafir, safir.
    Journey, traveller, ambassador — all from one root.
    ~ addFsrsCardFromInk("moon_w15", "inscription_camp_review")
    ~ addFsrsCardFromInk("camel_1", "inscription_camp_review")
    -> END

=== tier_partial ===
(You catch the desert night in these words — al-nujum... al-sahra'... almost there.)
* [I recognise "the stars" — al-nujum.]
    Al-nujum — the stars. They are the Bedouin's map at night.
    ~ addFsrsCardFromInk("star_w16", "inscription_camp_partial")
    ~ addFsrsCardFromInk("moon_w15", "inscription_camp_partial")
    -> END
* [I see "camel" and "desert".]
    Al-jamal — camel, safina al-sahra' — ship of the desert.
    ~ addFsrsCardFromInk("camel_1", "inscription_camp_partial")
    ~ addFsrsCardFromInk("desert_w18", "inscription_camp_partial")
    -> END

=== tier_none ===
(The inscription is scratched into a tent pole — ancient and worn, speaking of long journeys.)
* [What does it mean?]
    "We travelled across the desert land and found the way by the stars. Travel teaches wisdom."
    The root س-ف-ر gives safar — journey, musafir — traveller, and safir — ambassador.
    ~ addFsrsCardFromInk("star_w16", "inscription_camp_intro")
    ~ addFsrsCardFromInk("desert_w18", "inscription_camp_intro")
    -> END
* [I haven't learned desert words yet.]
    No matter. A journey begins with a single step.
    ~ addFsrsCardFromInk("camel_1", "inscription_camp_intro")
    ~ addFsrsCardFromInk("moon_w15", "inscription_camp_intro")
    -> END
