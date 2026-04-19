// inscription-marketplace.ink
// Vocabulary-gated comprehension for Desert Marketplace inscription (Zone 3, A2)
// Root: b-y-a (selling/trade) — wordIds: sell_w33, buy_w34, price_w29, merchant_w35
// ENVR-02: Full / Partial / None comprehension tiers based on vocab mastery

EXTERNAL getVocabMastery(wordId)
EXTERNAL addFsrsCardFromInk(wordId, source)

VAR knows_sell = 0
VAR knows_buy = 0
VAR knows_price = 0
VAR knows_merchant = 0
VAR comprehension_score = 0

-> check_vocab

=== check_vocab ===
~ knows_sell = getVocabMastery("sell_w33")
~ knows_buy = getVocabMastery("buy_w34")
~ knows_price = getVocabMastery("price_w29")
~ knows_merchant = getVocabMastery("merchant_w35")
~ comprehension_score = knows_sell + knows_buy + knows_price + knows_merchant
{comprehension_score >= 3:
    -> tier_full
}
{comprehension_score >= 1 && comprehension_score < 3:
    -> tier_partial
}
-> tier_none

=== tier_full ===
(You read the inscription with the eye of a merchant — each word clicks into place.)
* ["The seller is trustworthy and the buyer is wise."]
    Al-bai' — the seller. Al-mushtari — the buyer. Both from the root ب-ي-ع.
    ~ addFsrsCardFromInk("sell_w33", "inscription_marketplace_review")
    ~ addFsrsCardFromInk("buy_w34", "inscription_marketplace_review")
    -> END
* ["Sell with justice and buy with wisdom."]
    Bay' bil-adl — sell with justice. Shira' bil-hikma — buy with wisdom. A fair market!
    ~ addFsrsCardFromInk("price_w29", "inscription_marketplace_review")
    ~ addFsrsCardFromInk("merchant_w35", "inscription_marketplace_review")
    -> END

=== tier_partial ===
(Some market words catch your eye — al-bai'... bay'... the full meaning is close.)
* [I see "sell" and "buy".]
    Bay' — a sale. Shira' — a purchase. The root ب-ي-ع unites them.
    ~ addFsrsCardFromInk("sell_w33", "inscription_marketplace_partial")
    ~ addFsrsCardFromInk("buy_w34", "inscription_marketplace_partial")
    -> END
* [I recognise the word for "merchant".]
    Al-tajir or al-bai' — the merchant or seller. Trustworthiness is required in trade.
    ~ addFsrsCardFromInk("merchant_w35", "inscription_marketplace_partial")
    ~ addFsrsCardFromInk("price_w29", "inscription_marketplace_partial")
    -> END

=== tier_none ===
(The inscription above the market stalls is carved into the stone archway — you sense it is a trade principle.)
* [What does it say?]
    "The seller is trustworthy and the buyer is wise. Sell with justice and buy with wisdom."
    The root ب-ي-ع gives bay' — sale, and shira' — purchase. Ethical trade in one phrase.
    ~ addFsrsCardFromInk("sell_w33", "inscription_marketplace_intro")
    ~ addFsrsCardFromInk("buy_w34", "inscription_marketplace_intro")
    -> END
* [I'll learn market words first.]
    Good idea. The market awaits you.
    ~ addFsrsCardFromInk("merchant_w35", "inscription_marketplace_intro")
    -> END
