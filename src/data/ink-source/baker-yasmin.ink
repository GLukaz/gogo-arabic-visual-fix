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
صَبَاحُ الْخَيْر! أنا ياسمين، خبّازة الواحة. #vocab:good_morning_1
~ changeRelationship("baker-yasmin", 3)
صَبَاحُ الْخَيْر تعني "good morning" — نحييها عند الفجر.
شُمَّ رائحة الخُبْز الطازج من الفرن! #vocab:bread_1
* [ما سرّ خبزك اللذيذ؟]
  السرّ هو الحُبّ والصبر — وقليل من العَسَل! #vocab:honey_1
  العَسَل = honey، والخُبْز = bread — معاً يصنعان وليمة.
  -> baker_hub
* [علميني عن خبز العرب]
  الخبز عند العرب رمز الكرم.
  التَّمْر والخُبْز — وجبة البدوي الأصيلة! #vocab:dates_1
  التَّمْر تعني "dates" — فاكهة النخيل المباركة.
  -> baker_hub

=== returning_visitor ===
{getFlag("comprehension_yasmin_khubz_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً! خبز اليوم طازج وحار.
-> baker_hub

=== baker_hub ===
* {not getFlag("comprehension_yasmin_khubz_done")} [اختبريني عن الطعام]
  -> comprehension_check_khubz
* [أعطيني رغيف خبز]
  تفضّل، وبالهناء والشفاء!
  -> END
* [ما هو طعامك المفضل؟]
  أحب التمر بالعسل كثيراً! #vocab:happy_1
  السَّعِيد من يأكل طعام بلده — السَّعِيد = happy.
  -> END
* [مع السلامة]
  وداعاً! لا تنسَ تناول الإفطار.
  -> END

=== comprehension_check_khubz ===
خُبْز — تعني "bread" بالإنجليزية.
الخبز من أقدم الأطعمة في تاريخ البشرية.
~ setComprehensionCheck("ما معنى خُبْز؟", "خُبْز = bread", "خُبْز = water", "خُبْز = meat", 0)
ما هذا الطعام الذي أخبزه كل يوم؟ #comprehension_check
أحسنتَ! الخبز يجمع الناس على المائدة.
~ changeRelationship("baker-yasmin", 3)
~ setFlag("comprehension_yasmin_khubz_done")
-> END
