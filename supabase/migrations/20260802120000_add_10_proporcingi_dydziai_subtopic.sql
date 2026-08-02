-- 10 kl. „Proporcingieji dydžiai“ — potemė „Proporcingi dydžiai“
INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, 'proporcingi-dydziai', 'Proporcingi dydžiai', 3
FROM curriculum_topics t
WHERE t.grade = 10 AND t.slug = '10-proporcingieji-dydziai'
AND NOT EXISTS (
  SELECT 1 FROM curriculum_subtopics s
  WHERE s.topic_id = t.id AND s.slug = 'proporcingi-dydziai'
);
