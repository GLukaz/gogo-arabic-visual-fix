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
أهلاً! أنا مريم، عشّابة الواحة.
~ changeRelationship("herbalist-maryam", 3)
الأعشاب هي طبّ الطبيعة — "nature's medicine". #vocab:beautiful_1
شُمَّ هذا النبات — عشبة النعناع، رائحتها جميلة!
* [ما فوائد الأعشاب؟]
  العَسَل والزنجبيل يشفيان كثيراً من الأمراض. #vocab:honey_1
  العَسَل تعني "honey" — هدية النحل الكريمة.
  -> herb_hub
* [ما هذا النبات؟]
  هذا نبات الريحان — "basil". رائحته تُفرح القلب. #vocab:heart_1
  القَلْب تعني "heart" — وتعني أيضاً مركز العواطف.
  -> herb_hub

=== returning_visitor ===
{getFlag("comprehension_maryam_asal_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بالعودة! هل تريد وصفة عشبية جديدة؟
-> herb_hub

=== herb_hub ===
* {not getFlag("comprehension_maryam_asal_done")} [اختبريني عن الأعشاب]
  -> comprehension_check_asal
* {not getFlag("farm_nature_started")} [ساعديني في جمع الأعشاب]
  نعم! أحتاج أعشاباً من حقول الواحة.
  ~ startQuest("farm_nature")
  ~ setFlag("farm_nature_started")
  ~ changeRelationship("herbalist-maryam", 5)
  -> END
* [ما علاج الصداع؟]
  ضع الأعشاب الباردة على الجبهة. #vocab:cold_1
  البَارِد يعني "cold" — والبرودة تريح الألم.
  -> END
* [وداعاً]
  صحتك يا صديق! الطبيعة تعالج كل شيء.
  -> END

=== comprehension_check_asal ===
عَسَل — تعني "honey" بالإنجليزية.
النحل يجمع رحيق الزهور ويصنع العسل الحلو.
~ setComprehensionCheck("ما معنى عَسَل؟", "عَسَل = honey", "عَسَل = milk", "عَسَل = water", 0)
ماذا يصنع النحل؟ #comprehension_check
ممتاز! العسل في التراث العربي دواء وغذاء.
~ changeRelationship("herbalist-maryam", 3)
~ setFlag("comprehension_maryam_asal_done")
-> END
