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
أهلاً يا صديق! أنا حسان التاجر — أبيع وأشتري من كل بلاد العالم.
~ changeRelationship("trader-hassan", 3)
التجارة فن قديم يحتاج ذكاءً وصبراً ومعرفةً بالأسواق والناس.
السلعة الجيدة تبيع نفسها، لكن التاجر الذكي يعرف كيف يقدمها ويُساوم! #vocab:trade_1
* [ما أهم طرق التجارة القديمة؟]
  طريق الحرير كان شرياناً للتبادل التجاري بين الشرق والغرب.
  العرب كانوا وسطاء ممتازين — يتحدثون لغات كثيرة ويعرفون الثقافات.
  القوافل كانت تنقل البضائع والأفكار والأخبار معاً! #vocab:caravan_1
  رأيت قوافل تحمل الحرير والتوابل والذهب عبر هذه الصحراء.
  -> hassan_hub
* [ما أصعب شيء في التجارة؟]
  أصعب شيء هو المساومة — التفاوض على السعر بحكمة.
  تحتاج أن تعرف قيمة البضاعة جيداً قبل أن تبدأ.
  قاعدة ذهبية: لا تُظهر حاجتك الشديدة للبضاعة! #vocab:bargain_1
  التاجر الناجح يبيع بأعلى سعر ويشتري بأقل سعر.
  -> hassan_hub
* [من أين تأتي بضاعتك؟]
  من كل مكان! الهند والصين وبلاد الفرس وشمال أفريقيا.
  كل بلد له ميزة خاصة — الحرير من الصين، التوابل من الهند.
  الذهب والعاج من أفريقيا، والسجاد من إيران وتركيا.
  -> hassan_hub

=== returning_visitor ===
{getFlag("comprehension_hassan_tejara_done"):
  -> casual_return
}
-> first_meeting

=== casual_return ===
أهلاً بالزبون الذكي! هل جئت لصفقة جديدة اليوم؟
التسوق في الصحراء له نكهة خاصة — الهواء الجاف يجعل التفكير أوضح!
-> hassan_hub

=== hassan_hub ===
* {not getFlag("comprehension_hassan_tejara_done")} [اختبرني عن كلمات التجارة]
  -> comprehension_check_tejara
* {not getFlag("silk_road_quest_started")} [أريد أن أساعدك في البحث عن القوافل القديمة]
  ممتاز! أحتاج أحداً يجمع معلومات عن طرق القوافل التاريخية.
  إذا وجدت أي وثائق أو خرائط قديمة، أحضرها لي.
  هذه المعلومات تساعد التجار على فهم تاريخنا التجاري العريق!
  ~ startQuest("silk_road_investigation")
  ~ setFlag("silk_road_quest_started")
  ~ changeRelationship("trader-hassan", 5)
  -> END
* {not getFlag("merchants_guild_supported")} [أريد الانضمام إلى نقابة التجار]
  نقابة التجار تحمي أعضاءها وتفتح أبواباً في كل الأسواق.
  الأعضاء يحصلون على أفضل الأسعار والمعلومات السوقية.
  قراراتك الجيدة تُفيد المجتمع التجاري كله — هل تنضم؟
  ~ setFlag("merchants_guild_supported")
  ~ changeRelationship("trader-hassan", 8)
  أهلاً بك يا تاجر جديد في نقابتنا! #vocab:guild_1
  -> END
* [علمني كلمة تجارية مهمة]
  الميزان — يعني "balance" أو "scales" للوزن.
  التاجر الأمين يزن البضاعة بميزان عادل — العدل أساس الثقة. #vocab:balance_1
  ومن الميزان نشتق كلمة توازن — equilibrium.
  -> END
* [مع السلامة يا حسان]
  بالتوفيق! تذكر — الصدق في التجارة كنز لا يفنى.
  -> END

=== comprehension_check_tejara ===
كلمة مهمة في التجارة: صَفقة — تعني "deal" أو "transaction" بالإنجليزية.
الجذر ص-ف-ق — تشير إلى الصوت عند اتفاق الطرفين وضرب الأكف!
~ setComprehensionCheck("ما معنى صَفقة؟", "صَفقة = deal", "صَفقة = price", "صَفقة = market", 0)
ما معنى هذه الكلمة؟ #comprehension_check
تاجر ممتاز! الصفقة الجيدة تُسعد البائع والمشتري معاً.
~ changeRelationship("trader-hassan", 3)
~ setFlag("comprehension_hassan_tejara_done")
-> END
