/*
# 11 kl. Laipsniai ir šaknys — 5× lengvos, 5× vidutinės, 5× sunkios
# Juodraščiai (draft) — peržiūrai admin puslapyje; be sprendimų.
# Šaltinis: vadovėlio „Laipsniai“ ir „Šaknys“ skyrių stilius.
*/

DELETE FROM task_bank_items
WHERE generation_prompt = 'Seed: 11 kl. Laipsniai ir šaknys (manual)';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, status, source, generation_prompt)
SELECT 11, t.id, s.id, 'lengvos', q, a, '', 'draft', 'manual', 'Seed: 11 kl. Laipsniai ir šaknys (manual)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Apskaičiuokite: $27^{\frac{2}{3}}$.', '$9$'),
  ('Apskaičiuokite: $5^{\frac{1}{2}} \cdot 5^{\frac{3}{2}}$.', '$25$'),
  ('Apskaičiuokite: $\sqrt[3]{27 \cdot 64}$.', '$12$'),
  ('Pakeiskite laipsniu su racionaliuoju rodikliu: $\sqrt[4]{a^3}$, kai $a>0$.', '$a^{\frac{3}{4}}$'),
  ('Apskaičiuokite: $\frac{7^{\frac{5}{3}}}{7^{\frac{2}{3}}}$.', '$7$')
) AS v(q, a)
WHERE t.grade = 11 AND t.slug = '11-skaiciavimai' AND s.slug = 'laipsniai-ir-saknys';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, status, source, generation_prompt)
SELECT 11, t.id, s.id, 'vidutinės', q, a, '', 'draft', 'manual', 'Seed: 11 kl. Laipsniai ir šaknys (manual)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Suprastinkite: $\left(a^{\frac{1}{2}}+b^{\frac{1}{2}}\right)\left(a^{\frac{1}{2}}-b^{\frac{1}{2}}\right)$, kai $a>0$, $b>0$.', '$a-b$'),
  ('Apskaičiuokite: $\frac{4^{\frac{1}{3}} \cdot 16^{\frac{1}{2}}}{2^{\frac{2}{3}}}$.', '$4$'),
  ('Iškelkite daugiklį prieš šaknies ženklą: $\sqrt[3]{54a^7}$, kai $a>0$.', '$3a^2\sqrt[3]{2a}$'),
  ('Suprastinkite: $\sqrt[3]{\sqrt{a^{12}}}$, kai $a>0$.', '$a^2$'),
  ('Suprastinkite: $\sqrt[4]{(x-2)^4}$, kai $x<2$.', '$2-x$')
) AS v(q, a)
WHERE t.grade = 11 AND t.slug = '11-skaiciavimai' AND s.slug = 'laipsniai-ir-saknys';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, status, source, generation_prompt)
SELECT 11, t.id, s.id, 'sunkios', q, a, '', 'draft', 'manual', 'Seed: 11 kl. Laipsniai ir šaknys (manual)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Suprastinkite: $\frac{a^{\frac{1}{2}}-b^{\frac{1}{2}}}{a^{\frac{1}{2}}+b^{\frac{1}{2}}} + \frac{a^{\frac{1}{2}}+b^{\frac{1}{2}}}{a^{\frac{1}{2}}-b^{\frac{1}{2}}}$, kai $a>0$, $b>0$, $a \neq b$.', '$\frac{2(a+b)}{a-b}$'),
  ('Apskaičiuokite: $\left(\sqrt{21}-\sqrt{5}\right)^{\frac{1}{2}} \cdot \left(\sqrt{21}+\sqrt{5}\right)^{\frac{1}{2}}$.', '$4$'),
  ('Išskaidykite dauginamaisiais: $8x^3+27y^3$.', '$(2x+3y)(4x^2-6xy+9y^2)$'),
  ('Apskaičiuokite: $\frac{6^{3+\sqrt{5}}}{2^{3+\sqrt{5}} \cdot 3^{1+\sqrt{5}}}$.', '$9$'),
  ('Nustatykite reiškinio $(2x-6)^{-\frac{3}{7}}$ apibrėžimo sritį.', '$x \in (3;\,+\infty)$')
) AS v(q, a)
WHERE t.grade = 11 AND t.slug = '11-skaiciavimai' AND s.slug = 'laipsniai-ir-saknys';
