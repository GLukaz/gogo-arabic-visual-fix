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
مرحباً! أنا نور، الحكواتي.
~ changeRelationship("storyteller-noor", 3)
الحكواتي يروي القِصَص — "stories" — للناس.
قِصَّة تعني "story" بالإنجليزية.
* [احكِ لي قصة]
  كان يا ما كان، في قديم الزمان...
  كان هناك ملك حكيم يحب العلم.
  -> story_hub
* [ما هو فن الحكاية؟]
  الحكواتي فنان يروي القصص بصوته وجسده.
  ألف ليلة وليلة — أشهر مجموعة قصص عربية.
  -> story_hub

=== returning_visitor ===
{getFlag("comprehension_noor_qissah_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً! عندي قصة جديدة لك اليوم.
-> story_hub

=== story_hub ===
* {not getFlag("comprehension_noor_qissah_done")} [اختبرني عن القصص]
  -> comprehension_check_qissah
* [أريد سماع قصة]
  كان يا ما كان... اجلس واسمع!
  -> END
* [مع السلامة]
  إلى اللقاء! القصص لا تنتهي أبداً.
  -> END

=== comprehension_check_qissah ===
قِصَّة — تعني "story" بالإنجليزية.
الجمع: قِصَص. والفعل: قَصَّ يقُصّ — to narrate.
~ setComprehensionCheck("ما معنى قِصَّة؟", "قِصَّة = story", "قِصَّة = song", "قِصَّة = poem", 0)
ماذا تعلمتَ؟ #comprehension_check
أحسنتَ! كل كلمة جديدة هي قصة بحد ذاتها.
~ changeRelationship("storyteller-noor", 3)
~ setFlag("comprehension_noor_qissah_done")
-> END
