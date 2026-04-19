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
السلام عليكم! أنا عُمَر، الفلّاح.
~ changeRelationship("farmer-omar", 3)
انظر إلى هذه الشَجَرَة — كبيرة وجميلة!
شَجَرَة تعني "tree" بالإنجليزية.
* [ماذا تزرع؟]
  أزرع النخيل والزيتون والتين.
  النخلة أهم شجرة عند العرب — تعطينا التمر.
  -> farm_hub
* [أخبرني عن الزراعة العربية]
  الزراعة في الشرق قديمة جداً.
  العرب اخترعوا نظام الري بالقنوات.
  -> farm_hub

=== returning_visitor ===
{getFlag("comprehension_omar_shajarah_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً يا جاري! الحقل بخير والحمد لله.
-> farm_hub

=== farm_hub ===
* {not getFlag("comprehension_omar_shajarah_done")} [اختبرني عن النباتات]
  -> comprehension_check_shajarah
* [ساعدني في الحقل]
  تعال! العمل في الأرض مبارك.
  -> END
* [مع السلامة]
  الله معك! لا تنسَ أن تأكل تمراً.
  -> END

=== comprehension_check_shajarah ===
شَجَرَة — تعني "tree" بالإنجليزية.
الجمع: أشجار أو شَجَر.
~ setComprehensionCheck("ما معنى شَجَرَة؟", "شَجَرَة = tree", "شَجَرَة = flower", "شَجَرَة = river", 0)
ماذا تعلمتَ عن النباتات؟ #comprehension_check
أحسنتَ! الأرض تحب من يعرف أسماء أشجارها.
~ changeRelationship("farmer-omar", 3)
~ setFlag("comprehension_omar_shajarah_done")
-> END
