/*
# 10 kl. Kvadratinės nelygybės — sujungti grafinis ir intervalų metodai
*/

UPDATE curriculum_subtopics s
SET title = 'Grafinis ir intervalų metodai', slug = 'grafinis-ir-intervalu-metodai', sort_order = 2
FROM curriculum_topics t
WHERE s.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-kvadratines-nelygybes'
  AND s.slug = 'grafinis-budas';

UPDATE task_bank_items b
SET subtopic_id = s_graf.id
FROM curriculum_subtopics s_int, curriculum_subtopics s_graf, curriculum_topics t
WHERE b.subtopic_id = s_int.id
  AND s_int.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-kvadratines-nelygybes'
  AND s_int.slug = 'intervalu-budas'
  AND s_graf.topic_id = t.id
  AND s_graf.slug = 'grafinis-ir-intervalu-metodai';

DELETE FROM curriculum_subtopics s_int
USING curriculum_topics t
WHERE s_int.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-kvadratines-nelygybes'
  AND s_int.slug = 'intervalu-budas';

UPDATE curriculum_subtopics s
SET sort_order = 3
FROM curriculum_topics t
WHERE s.topic_id = t.id
  AND t.grade = 10
  AND t.slug = '10-kvadratines-nelygybes'
  AND s.slug = 'tekstiniai-uzdaviniai';
