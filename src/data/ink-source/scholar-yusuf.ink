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

~ gossip_line = getGossipToken("scholar-yusuf")
{gossip_line != "":
  -> gossip_knot
}
-> main

=== gossip_knot ===
{gossip_line}
~ gossip_grammar = getGossipGrammarNote("scholar-yusuf")
{gossip_grammar != "":
  [{gossip_grammar}]
}
~ markGossipHeard("scholar-yusuf")
-> main

=== main ===
{quest_act_1_complete:
  -> advanced_topics
- else:
  -> introduction
}

=== introduction ===
بسم الله الرحمن الرحيم. أنا يوسف، عالم المخطوطات.
~ changeRelationship("scholar-yusuf", 3)
هل تعلم أن بيت الحكمة في بغداد كان أعظم مكتبة في العالم؟
* [أخبرني المزيد عن بيت الحكمة]
  أسسه الخليفة هارون الرشيد في القرن الثامن الميلادي.
  ترجموا فيه كتب الإغريق والفرس والهنود إلى العربية.
  -> knowledge_hub
* [ما هذه المخطوطات؟]
  هذه مخطوطات من العصر الذهبي الإسلامي.
  فيها علوم الرياضيات والفلك والطب.
  -> knowledge_hub

=== advanced_topics ===
أهلاً بالعالم الشاب! أرى أنك تقدمت في رحلتك.
-> knowledge_hub

=== knowledge_hub ===
* [علمني كلمة جديدة]
  كلمة اليوم: مخطوط — manuscript.
  من جذر خ-ط-ط الذي يعني الكتابة.
  -> END
* [عن الخوارزمي]
  الخوارزمي أبو الجبر — كلمة algorithm مشتقة من اسمه!
  -> END
* {not getFlag("comprehension_yusuf_ilm_done")} [اختبرني عن العلم]
  -> comprehension_check_ilm
* {not getFlag("comprehension_yusuf_al_done")} [اختبرني عن ال التعريف]
  -> comprehension_check_al
* [وداعاً]
  في أمان الله. العلم نور.
  -> END

=== comprehension_check_ilm ===
عِلم — تعني "knowledge" أو "science"
هذا الجذر ع-ل-م أساس كلمات كثيرة: عالِم، مَعلومة، تَعليم.
~ setComprehensionCheck("ما معنى عِلم؟", "عِلم = knowledge", "عِلم = book", "عِلم = house", 0)
ما معنى الكلمة التي تعلمتها؟ #comprehension_check
مُمتاز! أنتَ عالِمٌ حقيقي.
~ changeRelationship("scholar-yusuf", 3)
~ setFlag("comprehension_yusuf_ilm_done")
-> END

=== comprehension_check_al ===
ال — هذا هو أداة التعريف في العربية، مثل "the" بالإنجليزية.
كِتاب = a book، الكِتاب = the book.
~ setComprehensionCheck("كيف نقول the book بالعربية؟", "الكِتاب", "كِتاب", "كُتُب", 0)
ماذا تعلمتَ؟ #comprehension_check
أحسنتَ! ال التعريف سهلة جداً.
~ changeRelationship("scholar-yusuf", 3)
~ setFlag("comprehension_yusuf_al_done")
-> END
