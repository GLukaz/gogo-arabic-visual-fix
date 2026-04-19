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
توقف أيها المسافر! الصحراء تُلهمني كل يوم — وأنت قادم في اللحظة المثالية.
~ changeRelationship("poet-desert", 3)
أنا كريم الشاعر — أتجول في الصحراء أبحث عن الكلمات التي تخفيها الرمال.
الشعر العربي أقدم من المدن — وُلد في هذه الفيافي تحت النجوم. #vocab:poetry_1
* [ما الذي يُلهمك للكتابة في الصحراء؟]
  الصمت المطبق الذي تسمع فيه نبضاتك.
  والنجوم — ملايين النقاط البيضاء على ستار أسود — تجعلك تشعر بالمتناهي الصغير.
  والرياح التي تحمل رائحة أماكن لم تزرها قط — هذا هو الإلهام الحقيقي! #vocab:inspiration_1
  الشعراء العرب القدماء كانوا يُعتبرون أنبياء قبائلهم ومتحدثيها.
  -> karim_hub
* [ما أشهر الأشعار العربية القديمة؟]
  المعلقات السبع — أعظم قصائد عصر ما قبل الإسلام.
  علقوها على أستار الكعبة تكريماً لجمالها وقوتها الأدبية.
  من أشهرها معلقة امرئ القيس: "قفا نبكِ من ذكرى حبيب ومنزل". #vocab:poetry_classic_1
  هذه القصائد وثّقت حياة العرب والبداوة والفروسية والحكمة.
  -> karim_hub
* [كيف يختلف الشعر العربي عن الغربي؟]
  الشعر العربي يهتم بالوزن والقافية اهتماماً عميقاً جداً.
  بحور الشعر — أنماط إيقاعية محددة — مثل الموسيقى للآذان.
  والصورة الشعرية في العربية أكثر غنى — اللغة تسمح بتراكب المعاني. #vocab:meter_1
  كلمة واحدة في العربية قد تحمل دلالات لا تُحصى بسبب الجذر الثلاثي!
  -> karim_hub

=== returning_visitor ===
{getFlag("comprehension_karim_shir_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
عدتَ يا رفيق الصحراء! سأُنشدك شيئاً جديداً اليوم.
القصائد تتجدد مثل الرمال — كل صباح أجد شيئاً جديداً.
-> karim_hub

=== karim_hub ===
* {not getFlag("comprehension_karim_shir_done")} [اختبرني عن الشعر العربي]
  -> comprehension_check_shir
* {not getFlag("ancient_verses_quest_started")} [أريد مساعدتك في البحث عن الأشعار القديمة المنسية]
  الأشعار القديمة؟ هذا يقرّب قلبي!
  في هذه الصحراء رُويت أشعار ضاعت مع القبائل المتفرقة.
  ابحث عن الواحات القديمة والمخيمات المهجورة — قد تجد أثراً لها.
  ~ startQuest("ancient_verses")
  ~ setFlag("ancient_verses_quest_started")
  ~ changeRelationship("poet-desert", 5)
  كل بيت شعر تجده سيكون مكسباً للإنسانية جمعاء!
  -> END
* {not getFlag("artists_guild_supported")} [هل توجد جماعة للشعراء والفنانين هنا؟]
  نعم! نحن نجتمع تحت النجوم ونتشارك الإبداع.
  الفن يحتاج مجتمعاً — القصيدة لا تكتمل إلا أمام أذن تسمع.
  هل تريد أن تنضم إلى حلقتنا الإبداعية يا رفيق؟
  ~ setFlag("artists_guild_supported")
  ~ changeRelationship("poet-desert", 8)
  أهلاً بفنان جديد في حلقة الإبداع! #vocab:creativity_1
  -> END
* [أنشدني بيتاً من الشعر]
  "والشعر لُبّ المرء يعرضه — على الجليس وقد يصونه"
  — للشاعر المتنبي، يقصد أن الشعر هو جوهر الإنسان الحقيقي. #vocab:poem_1
  المتنبي أعظم شعراء العرب — لا يزال شعره يُقرأ بعد ألف عام.
  -> END
* [مع السلامة يا كريم]
  في أمان الله! والصحراء ستحتضنك دائماً في أحضانها.
  -> END

=== comprehension_check_shir ===
كلمة شِعر — تعني "poetry" بالإنجليزية.
والشاعر هو poet — من الجذر ش-ع-ر الذي يعني الإدراك والإحساس.
~ setComprehensionCheck("ما معنى شِعر؟", "شِعر = poetry", "شِعر = story", "شِعر = music", 0)
ماذا تعني هذه الكلمة الجميلة؟ #comprehension_check
أحسنتَ! الشعر لغة القلب والعقل معاً.
~ changeRelationship("poet-desert", 3)
~ setFlag("comprehension_karim_shir_done")
-> END
