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
مرحباً! أنا سالم، دليل الواحة والصحراء.
~ changeRelationship("guide-salim", 3)
الدَّليل يقود المسافرين في الصحراء — "guide" بالإنجليزية.
أعرف كل طريق ووادٍ من هنا إلى الجبل! #vocab:where_is_1
* [أخبرني عن الصحراء]
  الصحراء جميلة وخطرة في نفس الوقت. #vocab:beautiful_1
  الجَمَل أفضل مركبة فيها — صبور وقوي. #vocab:camel_1
  الجَمَل = camel — سفينة الصحراء!
  -> guide_hub
* [كيف تجد الطريق في الصحراء؟]
  أتبع النجوم ليلاً والشمس نهاراً.
  المَاء هو الكنز الأول في الصحراء! #vocab:water_1
  المَاء = water — بدونه لا حياة.
  -> guide_hub

=== returning_visitor ===
{getFlag("comprehension_salim_jamal_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً يا مسافر! هل أنت مستعد للرحلة؟
-> guide_hub

=== guide_hub ===
* {not getFlag("comprehension_salim_jamal_done")} [اختبرني عن حيوانات الصحراء]
  -> comprehension_check_jamal
* {not getFlag("words_of_oasis_started")} [قودني في جولة الواحة]
  بكل سرور! الواحة مليئة بالأسرار والكلمات.
  ~ startQuest("words_of_oasis")
  ~ setFlag("words_of_oasis_started")
  ~ changeRelationship("guide-salim", 5)
  -> END
* [ما أخطر شيء في الصحراء؟]
  العطش أولاً، ثم الضياع. الحَارّ يُعبّ المَاء بسرعة. #vocab:hot_1
  الحَارّ = hot — في الصحراء يكون شديداً جداً!
  -> END
* [مع السلامة]
  إلى اللقاء! الصحراء تبقى في قلبك دائماً.
  -> END

=== comprehension_check_jamal ===
جَمَل — تعني "camel" بالإنجليزية.
الجمل يستطيع السير أسابيع بدون ماء — مذهل!
~ setComprehensionCheck("ما معنى جَمَل؟", "جَمَل = camel", "جَمَل = horse", "جَمَل = donkey", 0)
ما هو حيوان الصحراء الأهم؟ #comprehension_check
أحسنتَ! الجمل رفيق العربي في الصحراء.
~ changeRelationship("guide-salim", 3)
~ setFlag("comprehension_salim_jamal_done")
-> END
