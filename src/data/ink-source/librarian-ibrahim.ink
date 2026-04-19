EXTERNAL changeRelationship(npcId, amount)
EXTERNAL setLearningPath(path)
EXTERNAL startQuest(questId)
EXTERNAL getFlag(key)
EXTERNAL setFlag(key)
EXTERNAL getLearningPath()
EXTERNAL getGossipToken(npcId)
EXTERNAL markGossipHeard(npcId)
EXTERNAL getGossipGrammarNote(npcId)
EXTERNAL setComprehensionCheck(question, optionA, optionB, optionC, correctIndex)

VAR quest_act_1_complete = false
VAR gossip_line = ""
VAR gossip_grammar = ""

~ gossip_line = getGossipToken("librarian-ibrahim")
{gossip_line != "":
  -> gossip_knot
}
-> main

=== gossip_knot ===
{gossip_line}
~ gossip_grammar = getGossipGrammarNote("librarian-ibrahim")
{gossip_grammar != "":
  [{gossip_grammar}]
}
~ markGossipHeard("librarian-ibrahim")
-> main

=== main ===
{quest_act_1_complete:
  -> deep_collection
- else:
  -> welcome
}

=== welcome ===
أهلاً! أنا إبراهيم، أمين المكتبة.
~ changeRelationship("librarian-ibrahim", 3)
هذه المكتبة تحتوي على آلاف المخطوطات.
* [ما أهم كتاب هنا؟]
  كتاب الحيل لبني موسى — عن الآلات الميكانيكية.
  كُتب في القرن التاسع وما زلنا نتعلم منه!
  -> library_hub
* [كيف أجد كتاباً؟]
  المخطوطات مرتبة حسب الموضوع.
  الطب هنا، الفلك هناك، والرياضيات في الطابق العلوي.
  -> library_hub

=== deep_collection ===
عودة طيبة! عندي مخطوطات جديدة لأريك.
-> library_hub

=== library_hub ===
* [أريد أن أقرأ]
  تفضل. "اقرأ" — أول كلمة نزلت في القرآن.
  -> END
* [عن المكتبة]
  هذه المكتبة نموذج لبيت الحكمة الأصلي.
  -> END
* {not getFlag("comprehension_ibrahim_rtl_done")} [اختبرني عن القراءة]
  -> comprehension_check_rtl
* [شكراً]
  العفو. المعرفة حق للجميع.
  -> END

=== comprehension_check_rtl ===
العربية تُقرأ من اليمين إلى اليسار — right to left.
هذا عكس الإنجليزية والفرنسية.
~ setComprehensionCheck("كيف تُقرأ العربية؟", "من اليمين إلى اليسار", "من اليسار إلى اليمين", "من الأعلى إلى الأسفل", 0)
في أي اتجاه نقرأ؟ #comprehension_check
ممتاز! الآن أنت تعرف اتجاه القراءة الصحيح.
~ changeRelationship("librarian-ibrahim", 3)
~ setFlag("comprehension_ibrahim_rtl_done")
-> END
