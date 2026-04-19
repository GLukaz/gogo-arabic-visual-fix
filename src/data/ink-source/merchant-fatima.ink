EXTERNAL changeRelationship(npcId, amount)
EXTERNAL setLearningPath(path)
EXTERNAL startQuest(questId)
EXTERNAL getFlag(key)
EXTERNAL setFlag(key)
EXTERNAL getLearningPath()
EXTERNAL getGossipToken(npcId)
EXTERNAL markGossipHeard(npcId)
EXTERNAL getGossipGrammarNote(npcId)
EXTERNAL setComprehensionCheck(question, optionA, optionB, optionC, correctIndex)

VAR global_first_purchase_made = false
VAR gossip_line = ""
VAR gossip_grammar = ""

~ gossip_line = getGossipToken("merchant-fatima")
{gossip_line != "":
  -> gossip_knot
}
-> main

=== gossip_knot ===
{gossip_line}
~ gossip_grammar = getGossipGrammarNote("merchant-fatima")
{gossip_grammar != "":
  [{gossip_grammar}]
}
~ markGossipHeard("merchant-fatima")
-> main

=== main ===
{global_first_purchase_made:
  -> returning_customer
- else:
  -> first_visit
}

=== first_visit ===
أهلاً وسهلاً في دكاني! أنا فاطمة التاجرة.
~ changeRelationship("merchant-fatima", 3)
عندي أجود البضائع من طريق الحرير.
* [ماذا تبيعين؟]
  عندي توابل من الهند، حرير من الصين، وعطور من الحجاز.
  التجارة فن قديم — المساومة جزء منها!
  -> shop_hub
* [أخبريني عن طريق الحرير]
  طريق الحرير ربط الشرق بالغرب لألف سنة.
  التجار العرب كانوا وسطاء بين الحضارات.
  -> shop_hub

=== returning_customer ===
أهلاً بزبوني المفضل! عندي بضاعة جديدة اليوم.
-> shop_hub

=== shop_hub ===
* [أريد أن أشتري]
  تفضل، انظر إلى بضاعتي!
  -> END
* [علميني عن التجارة]
  كلمة سوق — market — من أقدم الكلمات العربية.
  وكلمة تاجر — merchant — من الجذر ت-ج-ر.
  -> END
* {not getFlag("comprehension_fatima_bikam_done")} [اختبريني عن الأسعار]
  -> comprehension_check_bikam
* [وداعاً]
  مع السلامة! ارجع قريباً.
  -> END

=== comprehension_check_bikam ===
في السوق تحتاج هذه العبارة: بِكَم هٰذا؟ — "how much is this?"
بِكَم = how much، هٰذا = this.
~ setComprehensionCheck("كيف تسأل how much is this؟", "بِكَم هٰذا؟", "ما هٰذا؟", "أين هٰذا؟", 0)
هيا، اسألني عن السعر! #comprehension_check
تاجر ممتاز! الآن تستطيع المساومة في أي سوق.
~ changeRelationship("merchant-fatima", 3)
~ setFlag("comprehension_fatima_bikam_done")
-> END
