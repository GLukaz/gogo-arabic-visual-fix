EXTERNAL setComprehensionCheck(question, optionA, optionB, optionC, correctIndex)
EXTERNAL setFlag(key)
EXTERNAL getFlag(key)
EXTERNAL changeRelationship(npcId, amount)

VAR onboarding_complete = false

{onboarding_complete:
  -> returning_visitor
- else:
  -> first_meeting
}

=== first_meeting ===
أَهلاً وَسَهلاً! أنا طارق، شيخ القبيلة.
~ changeRelationship("elder-tariq", 3)
أَهلاً وَسَهلاً تعني "welcome" — نقولها لكل ضيف.
عند البدو، الضيف عزيز دائماً.
* [أخبرني عن الضيافة]
  الضيافة عند العرب واجب مقدس.
  نقدم القهوة والتمر لكل ضيف.
  -> elder_hub
* [ما هي حياة البدو؟]
  البدو يعيشون في الصحراء مع الإبل والغنم.
  الصحراء معلمة صبورة — تعلمك الصبر والحكمة.
  -> elder_hub

=== returning_visitor ===
{getFlag("comprehension_tariq_ahlan_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بعودتك يا ابني! اجلس واشرب قهوة.
-> elder_hub

=== elder_hub ===
* {not getFlag("comprehension_tariq_ahlan_done")} [اختبرني عن الترحيب]
  -> comprehension_check_ahlan
* [احكِ لي قصة]
  في قديم الزمان، كان هناك بدوي حكيم...
  -> END
* [مع السلامة]
  في حفظ الله يا ابني.
  -> END

=== comprehension_check_ahlan ===
أَهلاً وَسَهلاً — عبارة ترحيب عربية كلاسيكية.
أَهلاً = you are among family، وَسَهلاً = at ease.
~ setComprehensionCheck("ما معنى أَهلاً وَسَهلاً؟", "أَهلاً وَسَهلاً = welcome", "أَهلاً وَسَهلاً = goodbye", "أَهلاً وَسَهلاً = thank you", 0)
كيف نرحب بالضيف؟ #comprehension_check
ممتاز! أنتَ تتعلم أدب العرب.
~ changeRelationship("elder-tariq", 3)
~ setFlag("comprehension_tariq_ahlan_done")
-> END
