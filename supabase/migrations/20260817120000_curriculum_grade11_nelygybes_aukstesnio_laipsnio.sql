-- 11 kl. Nelygybės — pirmoji potemė „Aukštesnės nei 2 laipsnio nelygybės“
UPDATE curriculum_subtopics s
SET sort_order = s.sort_order + 1
FROM curriculum_topics t
WHERE s.topic_id = t.id
  AND t.grade = 11
  AND t.slug = '11-nelygybes';

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, 'aukstesnes-nei-2-laipsnio', 'Aukštesnės nei 2 laipsnio nelygybės', 1
FROM curriculum_topics t
WHERE t.grade = 11 AND t.slug = '11-nelygybes'
AND NOT EXISTS (
  SELECT 1 FROM curriculum_subtopics s
  WHERE s.topic_id = t.id AND s.slug = 'aukstesnes-nei-2-laipsnio'
);
