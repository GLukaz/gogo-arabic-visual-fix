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
أهلاً يا بحّار! أنا راشد، قبطان السفينة.
~ changeRelationship("captain-rashid", 3)
البَحر — "the sea" — بيتي الحقيقي.
البحارة العرب كانوا أعظم ملّاحي العالم.
* [أخبرني عن البحر]
  البحر العربي كان طريق التجارة الأول.
  ابن ماجد — الملّاح العربي — اخترع البوصلة البحرية.
  -> sea_hub
* [إلى أين تسافر؟]
  إلى الهند والصين وشرق أفريقيا.
  التجارة البحرية ربطت العالم قبل الطائرات!
  -> sea_hub

=== returning_visitor ===
{getFlag("comprehension_rashid_bahr_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
عودة ميمونة يا صديقي! الرياح طيبة اليوم.
-> sea_hub

=== sea_hub ===
* {not getFlag("comprehension_rashid_bahr_done")} [اختبرني عن البحر]
  -> comprehension_check_bahr
* [خذني في رحلة]
  اركب! سنبحر مع الريح.
  -> END
* [مع السلامة]
  ريح طيبة يا صديقي! البحر ينتظرنا.
  -> END

=== comprehension_check_bahr ===
بَحر — تعني "sea" بالإنجليزية.
البَحر الأحمر، البَحر المتوسط — كلها بِحار مهمة.
~ setComprehensionCheck("ما معنى بَحر؟", "بَحر = sea", "بَحر = mountain", "بَحر = desert", 0)
ماذا تعلمتَ عن البحار؟ #comprehension_check
ممتاز! أنتَ مستعد لتكون بحّاراً.
~ changeRelationship("captain-rashid", 3)
~ setFlag("comprehension_rashid_bahr_done")
-> END
