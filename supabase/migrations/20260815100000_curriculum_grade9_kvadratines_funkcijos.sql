/*
# 9 kl. kvadratinės funkcijos — potemių pavadinimai su indeksais ir laipsniais
*/

UPDATE curriculum_subtopics
SET title = 'ax²+c'
WHERE slug = 'ax2-c' AND topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 9 AND slug = '9-kvadratines-funkcijos'
);

UPDATE curriculum_subtopics
SET title = 'ax²+bx+c'
WHERE slug = 'ax2-bx-c' AND topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 9 AND slug = '9-kvadratines-funkcijos'
);

UPDATE curriculum_subtopics
SET title = 'a(x−m)²+n'
WHERE slug = 'a-x-m-2-n' AND topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 9 AND slug = '9-kvadratines-funkcijos'
);

UPDATE curriculum_subtopics
SET title = 'a(x−x₁)(x−x₂)'
WHERE slug = 'a-x-x1-x-x2' AND topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 9 AND slug = '9-kvadratines-funkcijos'
);
