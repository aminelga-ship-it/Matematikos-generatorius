/*
# 10 kl. Panašios figūros — potemės pavadinimai (Horizontai)
*/

UPDATE curriculum_subtopics s
SET title = 'Trikampio panašumo požymiai'
FROM curriculum_topics t
WHERE s.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-panasios-figuros'
  AND s.slug = 'panasieji-trikampiai';

UPDATE curriculum_subtopics s
SET title = 'Panašieji daugiakampiai'
FROM curriculum_topics t
WHERE s.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-panasios-figuros'
  AND s.slug = 'panasieji-daugiakampiai';
