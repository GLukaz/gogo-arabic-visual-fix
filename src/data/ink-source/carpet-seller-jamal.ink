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
مرحباً! أنا جمال بائع السجاد — عندي أجمل وأفخم السجاد في المنطقة.
~ changeRelationship("carpet-seller-jamal", 3)
السجادة ليست مجرد أرضية — هي قصيدة منسوجة بالصبر والحب والفن.
كل سجادة عندي لها اسم وتاريخ ومكان أُنجزت فيه! #vocab:carpet_1
* [كيف تميز بين السجاد الجيد والرديء؟]
  أولاً، اعكس السجادة — الخيوط في الظهر يجب أن تكون منتظمة وثابتة.
  ثانياً، اضغط على الوبرة — إذا عادت مستقيمة فهي عالية الجودة.
  ثالثاً، انظر إلى كثافة العقد في البوصة المربعة — كلما زادت، كلما كانت أفخر. #vocab:knot_1
  السجاد اليدوي أفضل دائماً من السجاد الآلي في المتانة والجمال.
  -> jamal_hub
* [ما أثمن أنواع السجاد؟]
  السجاد الإيراني من مدينة تبريز وأصفهان — أثمن في العالم.
  والسجاد التركي القديم من إسطنبول — له مكانة تاريخية رفيعة.
  أما السجاد المغربي البربري — فقيمته في أنماطه الهندسية الفريدة. #vocab:persian_1
  كل منطقة تُدمج ثقافتها في أنماط السجاد — مثل لغة مرئية.
  -> jamal_hub
* [ما القصص التي تحكيها هذه الأنماط؟]
  هذه السجادة تحكي قصة بستان جنة — الزهور والطيور والمياه المتدفقة.
  وتلك تُصوّر معركة قديمة — الفارس والأسد والعلم المرفوع عالياً.
  الأنماط الهندسية في السجاد الإسلامي تمثل اللانهاية والتناغم الكوني. #vocab:geometric_1
  المسلمون برعوا في الأنماط الهندسية لأنها تعكس التوحيد والنظام.
  -> jamal_hub

=== returning_visitor ===
{getFlag("comprehension_jamal_sajjada_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بالضيف الكريم! لديّ وصلة جديدة من سجاد الأناضول — جميلة جداً.
هيا انظر — الألوان تُخبر قصص مدن عريقة!
-> jamal_hub

=== jamal_hub ===
* {not getFlag("comprehension_jamal_sajjada_done")} [اختبرني عن السجاد والأنماط]
  -> comprehension_check_sajjada
* {not getFlag("merchants_guild_supported")} [هل تنصحني بالانضمام إلى نقابة التجار؟]
  بالتأكيد! النقابة تفتح أمامك أبواب التجار الكبار.
  ستحصل على معلومات حصرية عن البضائع النادرة والأسعار المميزة.
  نحن التجار يجب أن نتعاون لنقف أمام الصعاب والمنافسة.
  ~ setFlag("merchants_guild_supported")
  ~ changeRelationship("carpet-seller-jamal", 8)
  انضممتَ! ستجد التجارة أسهل وأربح الآن. #vocab:cooperation_1
  -> END
* {not getFlag("desert_silk_quest_started")} [أريد مساعدتك في الحصول على حرير نادر]
  الحرير النادر؟ هذا تحدٍّ كبير!
  أحتاج حريراً من طريق الحرير القديم — عليك التواصل مع تجار القوافل.
  إذا نجحت، ستكون لك حصة في أجمل سجادة صنعتها في حياتي!
  ~ startQuest("desert_silk_quest")
  ~ setFlag("desert_silk_quest_started")
  ~ changeRelationship("carpet-seller-jamal", 5)
  -> END
* [علمني عن الألوان في السجاد]
  الأحمر يرمز للطاقة والقوة — هو اللون السائد في كثير من السجاد.
  الأزرق يرمز للسماء والحرية والسكينة الروحية. #vocab:red_1
  والذهبي يرمز للثروة والنور — يُستخدم في أقمشة الملوك والأمراء.
  -> END
* [مع السلامة يا جمال]
  بالسلامة! تذكر — السجادة الجيدة تبقى أجمل كل يوم مع الاستخدام.
  -> END

=== comprehension_check_sajjada ===
كلمة سجادة — تعني "carpet" أو "rug" بالإنجليزية.
الجمع سجاجيد أو سجّاد — وأصل الكلمة من السجود — الانحناء على الأرض.
~ setComprehensionCheck("ما معنى سَجادة؟", "سَجادة = carpet", "سَجادة = pillow", "سَجادة = curtain", 0)
ما معنى هذه الكلمة؟ #comprehension_check
ممتاز! الآن أنتَ تعرف أثمن ما في محلي!
~ changeRelationship("carpet-seller-jamal", 3)
~ setFlag("comprehension_jamal_sajjada_done")
-> END
