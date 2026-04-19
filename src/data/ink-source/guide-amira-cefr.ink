EXTERNAL changeRelationship(npcId, amount)
EXTERNAL setFlag(key)
EXTERNAL getFlag(key)

VAR cefr_level = ""
VAR milestone_shown = false

-> check_milestone

=== check_milestone ===
{cefr_level == "A1":
  -> milestone_a1
}
{cefr_level == "A2":
  -> milestone_a2
}
{cefr_level == "B1":
  -> milestone_b1
}
{cefr_level == "B2":
  -> milestone_b2
}
-> fallback

=== milestone_a1 ===
مبروك يا صديقي! وصلت إلى المستوى الأول!
You've reached A1 — the first step on your Arabic journey.
أنت الآن تستطيع فهم الكلمات الأساسية والتحيات.
~ changeRelationship("guide-amira", 10)
~ setFlag("cefr_milestone_a1_shown")
* [شكراً يا أميرة!]
  عفواً! واصل التعلم — الطريق طويل لكنك بدأت بقوة!
  -> END
* [ما المستوى التالي؟]
  المستوى التالي A2 — ستتمكن من فهم الجمل البسيطة والمحادثات اليومية.
  -> END

=== milestone_a2 ===
ما شاء الله! وصلت إلى المستوى الثاني!
A2 achieved — you can now understand everyday expressions and basic phrases.
أنت تتقدم بسرعة رائعة!
~ changeRelationship("guide-amira", 15)
~ setFlag("cefr_milestone_a2_shown")
* [الحمد لله!]
  نعم، الحمد لله! لغتك العربية تتحسن يوماً بعد يوم.
  -> END
* [هل أستطيع قراءة القصص الآن؟]
  قريباً! في المستوى B1 ستقرأ نصوصاً أطول وتفهم الأفكار الرئيسية.
  -> END

=== milestone_b1 ===
يا سلام! المستوى B1 — أنت الآن متحدث متوسط!
B1 unlocked — you can understand the main points of clear standard speech on familiar matters.
هذا إنجاز كبير. أنا فخورة بك!
~ changeRelationship("guide-amira", 20)
~ setFlag("cefr_milestone_b1_shown")
* [شكراً! أريد أن أتعلم أكثر]
  هذه الروح! المستوى B2 يفتح عالماً جديداً من الفهم العميق.
  -> END
* [ماذا يمكنني أن أفعل الآن؟]
  يمكنك فهم المحادثات اليومية، قراءة المقالات البسيطة، والتعبير عن رأيك.
  -> END

=== milestone_b2 ===
لا أصدق! المستوى B2 — أنت الآن متقدم في العربية!
B2 mastery — you can understand complex texts and interact with fluency and spontaneity.
أنت أصبحت عالماً حقيقياً في اللغة العربية!
~ changeRelationship("guide-amira", 25)
~ setFlag("cefr_milestone_b2_shown")
* [هذه رحلة رائعة!]
  نعم! وما زال أمامك الكثير لاكتشافه في عالم اللغة العربية.
  -> END
* [ما هو هدفي التالي؟]
  الآن يمكنك التركيز على الطلاقة — القراءة الحرة والمحادثة مع الناطقين بالعربية.
  -> END

=== fallback ===
أهلاً! واصل رحلتك في تعلم العربية.
-> END
