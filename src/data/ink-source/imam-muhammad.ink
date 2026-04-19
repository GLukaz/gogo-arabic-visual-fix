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
السَّلامُ عَلَيْكُم ورحمة الله! أنا الإمام محمد. #vocab:salaam
~ changeRelationship("imam-muhammad", 3)
السَّلامُ عَلَيْكُم هي تحية الإسلام — "peace be upon you".
نردّ عليها: وَعَلَيْكُم السَّلام — "and upon you peace".
* [علمني عن الصلاة]
  الصلاة عمود الإسلام — يصلي المسلم خمس مرات يومياً.
  الفَجْر، الظُّهْر، العَصْر، المَغْرِب، والعِشَاء.
  -> imam_hub
* [ما معنى الحمد لله؟]
  الحَمْد لله — "praise be to God" — نقولها عند كل نعمة. #vocab:alhamdulillah
  نقولها عند الأكل والشرب والصحة والسلامة.
  -> imam_hub

=== returning_visitor ===
{getFlag("comprehension_imam_salam_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بك يا ابني! هل لديك سؤال في الدين أو اللغة؟
-> imam_hub

=== imam_hub ===
* {not getFlag("comprehension_imam_salam_done")} [اختبرني عن التحية الإسلامية]
  -> comprehension_check_salam
* {not getFlag("palace_faith_started")} [أريد تعلم كلمات الإيمان]
  يسعدني! اللغة العربية لغة القرآن الكريم.
  ~ startQuest("palace_faith")
  ~ setFlag("palace_faith_started")
  ~ changeRelationship("imam-muhammad", 5)
  -> END
* [ما معنى بسم الله؟]
  بِسْمِ اللَّه الرَّحْمٰن الرَّحِيم — نبدأ بها كل عمل. #vocab:bismillah
  بِسْمِ = in the name of، اللَّه = God.
  -> END
* [مع السلامة]
  في حفظ الله ورعايته. وداعاً يا ابني.
  -> END

=== comprehension_check_salam ===
السَّلامُ عَلَيْكُم — تحية الإسلام بين المسلمين.
السَّلام = peace، عَلَيْكُم = upon you.
~ setComprehensionCheck("ما معنى السَّلامُ عَلَيْكُم؟", "السَّلام = peace be upon you", "السَّلام = good morning", "السَّلام = goodbye", 0)
كيف يحيّي المسلمون بعضهم؟ #comprehension_check
ممتاز! هذه التحية تنشر السلام في العالم.
~ changeRelationship("imam-muhammad", 3)
~ setFlag("comprehension_imam_salam_done")
-> END
