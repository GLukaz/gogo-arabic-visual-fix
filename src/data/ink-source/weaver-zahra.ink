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
أهلاً بك! أنا زهراء النساجة — أصنع أجمل الأقمشة في السوق.
~ changeRelationship("weaver-zahra", 3)
الحياكة فن عريق — أمهاتنا وجداتنا علّمننا كل نقش وكل لون.
كل نقش في القماش يحكي قصة — تاريخ العائلة وهوية القبيلة. #vocab:weave_1
* [كيف تتعلمين هذه الأنماط الجميلة؟]
  تعلمت من أمي وهي من جدتها — سلسلة متواصلة عبر الأجيال.
  بعض الأنماط لها معانٍ خاصة — النجمة السداسية ترمز للحماية.
  والنخلة ترمز للرزق والخير، والماء يرمز للحياة والاستمرار. #vocab:pattern_1
  كل منطقة في العالم العربي لها أنماطها الخاصة المميزة!
  -> zahra_hub
* [ما الفرق بين أنواع الأقمشة؟]
  الحرير ناعم وثمين — مناسب للملابس الفاخرة والمناسبات الكبيرة.
  القطن متين ومريح — مناسب للحياة اليومية في كل الفصول.
  الصوف دافئ وقوي — لليالي الباردة والرحلات في الجبال. #vocab:fabric_1
  الكتان من أقدم الأقمشة في التاريخ — المصريون القدماء أتقنوه!
  -> zahra_hub
* [كم من الوقت يستغرق نسج قطعة واحدة؟]
  السجادة الكبيرة تستغرق شهوراً من العمل اليومي المستمر.
  أنا أعمل من الفجر حتى المغرب — والأصابع تتعلم وحدها.
  الصبر هو أهم صفة في النساج — العجلة تُفسد النقش! #vocab:patience_1
  لكن عندما ترى العمل النهائي، كل التعب يختفي.
  -> zahra_hub

=== returning_visitor ===
{getFlag("comprehension_zahra_nasij_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بك من جديد! انظر، لدي قماش جديد بنقوش رائعة.
الألوان الطازجة تجعل السوق حياً ومبهجاً!
-> zahra_hub

=== zahra_hub ===
* {not getFlag("comprehension_zahra_nasij_done")} [اختبريني عن النسيج والحياكة]
  -> comprehension_check_nasij
* {not getFlag("artisan_patterns_quest_started")} [أريد مساعدتك في جمع الأنماط التقليدية القديمة]
  هذا رائع! الأنماط القديمة تختفي ببطء لأن الناس ينسون.
  إذا وجدت أي أقمشة قديمة أو رسومات للأنماط، احضرها لي.
  سأوثقها وأعلّم الجيل الجديد حتى لا تضيع هذه الكنوز!
  ~ startQuest("artisan_patterns")
  ~ setFlag("artisan_patterns_quest_started")
  ~ changeRelationship("weaver-zahra", 5)
  -> END
* [أين يمكنني شراء قمشاً جيداً؟]
  عندي! وعند جمال بائع السجاد أيضاً — كلانا نقدر الحرفة الجيدة.
  تجنب البضاعة الرخيصة — قد تبدو جيدة لكنها لا تدوم طويلاً.
  البضاعة الجيدة ثمنها عادل — والعمر الطويل يُبرر الثمن! #vocab:quality_1
  -> END
* [علميني كلمة عن الألوان]
  أزرق — "blue" بالإنجليزية.
  اللون الأزرق مهم في الفنون الإسلامية — يرمز للسماء والأبدية. #vocab:blue_1
  والأزرق الفيروزي مميز جداً في الفخار والزليج المغربي!
  -> END
* [شكراً يا زهراء، مع السلامة]
  مع السلامة! تعال تنظر للأقمشة الجديدة عندما تصل.
  -> END

=== comprehension_check_nasij ===
كلمة النسيج — تعني "fabric" أو "textile" بالإنجليزية.
الجذر ن-س-ج يعني الربط والضفر — مثل بناء القماش خيطاً خيطاً.
~ setComprehensionCheck("ما معنى نَسيج؟", "نَسيج = fabric", "نَسيج = color", "نَسيج = needle", 0)
ماذا تعلمتَ؟ #comprehension_check
أحسنتَ! النسيج فن يحتاج اليد والعقل والقلب معاً.
~ changeRelationship("weaver-zahra", 3)
~ setFlag("comprehension_zahra_nasij_done")
-> END
