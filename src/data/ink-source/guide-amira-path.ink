EXTERNAL setLearningPath(path)
EXTERNAL getFlag(key)

-> start

=== start ===
~ temp already_chosen = getFlag("onboarding_path_chosen")
{already_chosen:
  -> END
}
-> what_draws_you

=== what_draws_you ===
أهلاً يا صديقي! رأيت كيف تعلمت كلمتك الأولى.
ما الذي يجذبك إلى العربية؟

* [القارئ — طريق العلم والقراءة]
  يا للروعة! طريق القارئ يناسبك.
  ستتعلم مفردات الكتب والعلوم والخط العربي.
  يوسف العالم سيكون مرشدك الأول.
  ~ setLearningPath("scholar")
  -> path_confirmed

* [المسافر — طريق الرحلة والحوار]
  رائع! المسافر يتعلم من كل لقاء.
  ستتعلم التحيات والأسئلة واللغة اليومية.
  سأكون مرشدتك الأولى في هذا الطريق.
  ~ setLearningPath("traveler")
  -> path_confirmed

* [المؤرخ — طريق التاريخ والحضارة]
  ممتاز! التاريخ يبدأ من اللغة.
  ستتعلم مفردات العصر الذهبي والعلوم والتجارة.
  الشيخ طارق سيكون مرشدك الأول.
  ~ setLearningPath("historian")
  -> path_confirmed

=== path_confirmed ===
كل الطرق تعلّم نفس العربية الفصحى — الفرق في الترتيب والأولوية.
يمكنك تغيير طريقك لاحقاً من الإعدادات.
الآن، لنبدأ مغامرتك الأولى!
-> END
