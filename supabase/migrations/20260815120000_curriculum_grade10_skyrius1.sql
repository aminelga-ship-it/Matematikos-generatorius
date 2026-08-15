/*
# 10 kl. 1 skyrius (Horizontai): potemė „Matematinių modelių taikymas“ ir eilės tvarka
*/

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, 'matematiniu-modeliu-sprendziant-problemas', 'Matematinių modelių taikymas', 1
FROM curriculum_topics t
WHERE t.grade = 10 AND t.slug = '10-proporcingieji-dydziai'
AND NOT EXISTS (
  SELECT 1 FROM curriculum_subtopics s
  WHERE s.topic_id = t.id AND s.slug = 'matematiniu-modeliu-sprendziant-problemas'
);

UPDATE curriculum_subtopics s
SET sort_order = 2
FROM curriculum_topics t
WHERE s.topic_id = t.id AND t.grade = 10 AND t.slug = '10-proporcingieji-dydziai'
  AND s.slug = 'proporcingi-dydziai';

UPDATE curriculum_subtopics s
SET sort_order = 3
FROM curriculum_topics t
WHERE s.topic_id = t.id AND t.grade = 10 AND t.slug = '10-proporcingieji-dydziai'
  AND s.slug = 'sudetiniai-procentai';

UPDATE curriculum_subtopics s
SET sort_order = 4
FROM curriculum_topics t
WHERE s.topic_id = t.id AND t.grade = 10 AND t.slug = '10-proporcingieji-dydziai'
  AND s.slug = 'procentu-taikymo-uzdaviniai';
