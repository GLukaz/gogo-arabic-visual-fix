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
السلام عليكم! أنا علي المتجول — أعرف كل طريق في الصحراء.
~ changeRelationship("wanderer-ali", 3)
الصحراء ليست مجرد رمال — هي كتاب مفتوح لمن يعرف كيف يقرأها.
الرياح تُخبرك باتجاهك، والنجوم تُرشدك في الليل. #vocab:desert_1
* [كيف تتنقل في الصحراء بدون خريطة؟]
  النجم القطبي هو دليلك الأول — دائماً في الشمال.
  الشمس تشرق من الشرق وتغرب في الغرب — هذا يكفيك نهاراً.
  والرياح الموسمية لها أنماط ثابتة — الريح الشمالية تعني البرد. #vocab:star_1
  البدو يستطيعون قراءة الصحراء مثل قراءة الكتاب!
  -> ali_hub
* [ما أخطر شيء في الصحراء؟]
  أخطر شيء هو العطش — الماء هو الحياة في الصحراء.
  القوافل تحمل قِرَباً كثيرة للماء والطعام للرحلات الطويلة.
  والعواصف الرملية تُخفي كل شيء — يجب أن تعرف كيف تحتمي. #vocab:thirst_1
  الجمل يستطيع السير أياماً بدون ماء — لهذا هو سفينة الصحراء!
  -> ali_hub
* [أخبرني عن القوافل التجارية]
  القافلة كانت وسيلة النقل الأساسية قبل السيارات والطائرات.
  مئات الجمال تحمل البضائع والتجار والحماية.
  القوافل كانت تسير ليلاً أحياناً لتجنب حرارة الشمس!
  -> ali_hub

=== returning_visitor ===
{getFlag("comprehension_ali_sahara_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بالمسافر المتمرس! الطريق دائماً ينتظرك.
الصحراء تغيّر وجهها كل يوم، لكن قوانينها ثابتة.
-> ali_hub

=== ali_hub ===
* {not getFlag("comprehension_ali_sahara_done")} [اختبرني عن الصحراء والسفر]
  -> comprehension_check_sahara
* {not getFlag("desert_paths_quest_started")} [أريد أن تعلمني طرق الصحراء السرية]
  الطرق السرية؟ هذا موضوع حساس.
  أولاً، أثبت أنك تستحق الثقة — اكتشف ثلاثة معالم في منطقة الواحة.
  عندما تعود بالمعلومات، سأريك طرقاً لا يعرفها إلا القليلون!
  ~ startQuest("desert_paths")
  ~ setFlag("desert_paths_quest_started")
  ~ changeRelationship("wanderer-ali", 5)
  -> END
* {not getFlag("travelers_brotherhood_joined")} [هل يمكنني الانضمام إلى إخوة المسافرين؟]
  إخوة المسافرين جماعة من الناس يحبون الاستكشاف والسفر.
  نتشارك المعلومات ونحمي بعضنا في الطريق.
  الانضمام يعني الالتزام بمساعدة كل مسافر يحتاج العون!
  ~ setFlag("travelers_brotherhood_joined")
  ~ changeRelationship("wanderer-ali", 8)
  مرحباً بك يا أخ! نحن نسافر معاً. #vocab:journey_1
  -> END
* [علمني كلمة عن الطبيعة]
  واحة — تعني "oasis" بالإنجليزية.
  هي بقعة خضراء في قلب الصحراء، حيث يوجد الماء والنخيل. #vocab:oasis_1
  كلمة واحة أصبحت مستخدمة في اللغات الأوروبية أيضاً!
  -> END
* [مع السلامة يا علي]
  في حماية الله! الطريق أمامك دائماً.
  -> END

=== comprehension_check_sahara ===
كلمة مهمة للمسافر: قافلة — تعني "caravan" بالإنجليزية.
مجموعة من الجمال والتجار تسير معاً للحماية والتعاون.
~ setComprehensionCheck("ما معنى قافلة؟", "قافلة = caravan", "قافلة = desert", "قافلة = water", 0)
ماذا تعني هذه الكلمة؟ #comprehension_check
أحسنتَ! القافلة قوة — لأن الاتحاد أمان في الصحراء.
~ changeRelationship("wanderer-ali", 3)
~ setFlag("comprehension_ali_sahara_done")
-> END
