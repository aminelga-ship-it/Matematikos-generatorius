/*
# 11 kl. Aibės — 4× lengvos, 4× vidutinės, 4× sunkios (patvirtintos, be sprendimų)
*/

DELETE FROM task_bank_items
WHERE generation_prompt = 'Seed: 11 kl. Aibės (manual)';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, status, source, generation_prompt)
SELECT 11, t.id, s.id, 'lengvos', q, a, '', 'approved', 'manual', 'Seed: 11 kl. Aibės (manual)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Aibės $A=\{1;\,2;\,3;\,4\}$ ir $B=\{3;\,4;\,5\}$. Raskite $A \cap B$.', '$\{3;\,4\}$'),
  ('Aibės $A=\{0;\,1;\,2\}$ ir $B=\{2;\,3;\,4\}$. Raskite $A \cup B$.', '$\{0;\,1;\,2;\,3;\,4\}$'),
  ('Aibės $A=\{5;\,10;\,15\}$ ir $B=\{10;\,20\}$. Raskite $A \setminus B$.', '$\{5;\,15\}$'),
  ('Aibė $A=\{-2;\,-1;\,0;\,1;\,2\}$. Kiek elementų turi $A \cap \mathbb{N}$? ($\mathbb{N}=\{1;\,2;\,3;\,\ldots\}$)', '$2$')
) AS v(q, a)
WHERE t.grade = 11 AND t.slug = '11-skaiciavimai' AND s.slug = 'aibes';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, status, source, generation_prompt)
SELECT 11, t.id, s.id, 'vidutinės', q, a, '', 'approved', 'manual', 'Seed: 11 kl. Aibės (manual)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Intervalai $A=[1;\,5]$ ir $B=[3;\,7]$. Raskite $A \cap B$.', '$[3;\,5]$'),
  ('Intervalai $A=[-2;\,4]$ ir $B=[0;\,6]$. Raskite $A \cup B$.', '$[-2;\,6]$'),
  ('Suvienalytė aibė $U=\{1;\,2;\,3;\,4;\,5;\,6\}$, $A=\{2;\,4;\,6\}$. Raskite $\bar{A}$ santykyje su $U$.', '$\{1;\,3;\,5\}$'),
  ('Dviženklį skaičių užrašome $10a+b$ ($a$ — dešimčių, $b$ — vienetų skaitmuo). Raskite $a+b$, jei $10a+b=58$.', '$13$')
) AS v(q, a)
WHERE t.grade = 11 AND t.slug = '11-skaiciavimai' AND s.slug = 'aibes';

INSERT INTO task_bank_items (grade, topic_id, subtopic_id, difficulty, question, answer, solution, status, source, generation_prompt)
SELECT 11, t.id, s.id, 'sunkios', q, a, '', 'approved', 'manual', 'Seed: 11 kl. Aibės (manual)'
FROM curriculum_topics t
JOIN curriculum_subtopics s ON s.topic_id = t.id
CROSS JOIN (VALUES
  ('Apskaičiuokite: $([-1;\,4] \cap [2;\,6]) \setminus (3;\,5)$.', '$[2;\,3] \cup \{4\}$'),
  ('Apskaičiuokite: $([-3;\,2] \cup [1;\,5]) \setminus [-1;\,3]$.', '$[-3;\,-1) \cup (3;\,5]$'),
  ('Raskite dviženklių natūraliųjų skaičių, kurie dalijasi iš $5$, ir dviženklių skaičių, kurie baigiasi skaitmeniu $1$, aibių sankirtą.', '$\{51\}$'),
  ('Dviženklį skaičių $10a+b$ sudaro skaitmenys $a$ ir $b$. Raskite tokių dviženklių skaičių, kurie dalijasi iš $3$ ir kurių $a+b=9$, aibę.', '$\{18;\,27;\,36;\,45;\,54;\,63;\,72;\,81;\,90\}$')
) AS v(q, a)
WHERE t.grade = 11 AND t.slug = '11-skaiciavimai' AND s.slug = 'aibes';
