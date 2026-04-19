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
أهلاً! أنا ليلى، بائعة التَوابِل.
~ changeRelationship("spice-seller-layla", 3)
شُمّ هذا — زعفران من إيران، وكَمّون من مصر!
التَوابِل تعني "spices" — كنز من كنوز الشرق.
* [ما أفضل التوابل؟]
  الزعفران أغلى توابل العالم — يُسمى الذهب الأحمر.
  والكركم مفيد جداً للصحة.
  -> spice_hub
* [من أين تأتي التوابل؟]
  من الهند والصين وإيران ومصر.
  طريق الحرير كان طريق التوابل أيضاً!
  -> spice_hub

=== returning_visitor ===
{getFlag("comprehension_layla_tawabil_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
مرحباً بعودتك! هل تريد شمّ توابل جديدة اليوم؟
-> spice_hub

=== spice_hub ===
* {not getFlag("comprehension_layla_tawabil_done")} [اختبريني عن التوابل]
  -> comprehension_check_tawabil
* [أريد شراء توابل]
  تفضل! عندي أجود الأنواع.
  -> END
* [وداعاً]
  مع السلامة! لا تنسَ أن التوابل سرّ الطبخ.
  -> END

=== comprehension_check_tawabil ===
تَوابِل — تعني "spices" بالإنجليزية.
الجمع من توبِل أو تابِل.
~ setComprehensionCheck("ما معنى تَوابِل؟", "تَوابِل = spices", "تَوابِل = fruits", "تَوابِل = flowers", 0)
ماذا تعلمتَ؟ #comprehension_check
أحسنتَ! الآن أنتَ تعرف سرّ المطبخ العربي.
~ changeRelationship("spice-seller-layla", 3)
~ setFlag("comprehension_layla_tawabil_done")
-> END
