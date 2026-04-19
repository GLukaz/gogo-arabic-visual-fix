EXTERNAL setComprehensionCheck(question, optionA, optionB, optionC, correctIndex)
EXTERNAL setFlag(key)
EXTERNAL getFlag(key)
EXTERNAL changeRelationship(npcId, amount)
EXTERNAL startQuest(questId)

VAR onboarding_complete = false

{onboarding_complete:
  -> returning_visitor
- else:
  -> first_meeting
}

=== first_meeting ===
السلام عليكم! أنا حمزة، حارس الواحة.
~ changeRelationship("guard-hamza", 3)
أنا أحمي الواحة من الأخطار — "protect" بالإنجليزية. #vocab:strong_1
الحارس يعرف كل طريق في القرية.
* [كيف أصل إلى السوق؟]
  السوق يَمِين — "right". اسمع: يَمِين، يَسَار، أَمَام. #vocab:where_is_the_market_1
  يَمِين = right، يَسَار = left، أَمَام = in front.
  -> guard_hub
* [ما مهمتك هنا؟]
  أدور حول الواحة ليلاً ونهاراً.
  الأمان أهم شيء — "safety" بالإنجليزية.
  -> guard_hub

=== returning_visitor ===
{getFlag("comprehension_hamza_yamin_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
مرحباً بك يا صديق! الواحة بأمان.
-> guard_hub

=== guard_hub ===
* {not getFlag("comprehension_hamza_yamin_done")} [اختبرني عن الاتجاهات]
  -> comprehension_check_yamin
* {not getFlag("guard_directions_started")} [أريد مساعدة في الحراسة]
  هيا! أحتاج مساعدة في فحص الطرق.
  ~ startQuest("guard_directions")
  ~ setFlag("guard_directions_started")
  ~ changeRelationship("guard-hamza", 5)
  -> END
* [أين المسجد؟]
  المسجد أَمَامَك — تماماً في المنتصف. #vocab:where_is_1
  اتبع الأذان وستصل!
  -> END
* [مع السلامة]
  في حماية الله! الطريق آمن.
  -> END

=== comprehension_check_yamin ===
يَمِين تعني "right" — الاتجاه الأيمن.
يَسَار تعني "left"، وأَمَام تعني "in front".
~ setComprehensionCheck("ما معنى يَمِين؟", "يَمِين = right", "يَمِين = left", "يَمِين = in front", 0)
أين تذهب إذا قلت يَمِين؟ #comprehension_check
أحسنتَ! الآن لن تضيع في الواحة.
~ changeRelationship("guard-hamza", 3)
~ setFlag("comprehension_hamza_yamin_done")
-> END
