/*
  2–4 kl. curriculum: tekstinių potemių šalinimas, 4 kl. geometrija + stereometrija
*/

-- 2 kl.: visa tema „Tekstiniai uždaviniai su matavimo vienetais“
DELETE FROM curriculum_subtopics
WHERE topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 2 AND slug = '2-tekstiniai-uzdaviniai-su-matavimo-vienetais'
);
DELETE FROM curriculum_topics
WHERE grade = 2 AND slug = '2-tekstiniai-uzdaviniai-su-matavimo-vienetais';

-- 2 kl.: simetrija
DELETE FROM curriculum_subtopics
WHERE slug = 'simetrija'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 2 AND slug = '2-geometrija');

-- 2–4 kl.: tekstinių potemių šalinimas
DELETE FROM curriculum_subtopics
WHERE topic_id IN (SELECT id FROM curriculum_topics WHERE grade IN (2, 3, 4))
  AND (
    slug IN (
      'tekstiniai-uzdaviniai',
      'kiti-tekstiniai-uzdaviniai',
      'dvieju-zingsniu-tekstiniai-uzdaviniai'
    )
    OR title ILIKE 'Tekstiniai uždaviniai%'
    OR title ILIKE 'Kiti tekstiniai užd.%'
    OR title ILIKE 'Kiti tekstiniai uždaviniai%'
    OR title ILIKE 'Dviejų žingsnių tekstiniai%'
  );

-- 4 kl.: Geometrija (be „2D“) + stereometrija kaip potemė
UPDATE curriculum_topics
SET title = 'Geometrija', slug = '4-geometrija'
WHERE grade = 4 AND slug = '4-geometrija-2d';

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, 'stereometrija', 'Stereometrija', 4
FROM curriculum_topics t
WHERE t.grade = 4 AND t.slug = '4-geometrija'
  AND NOT EXISTS (
    SELECT 1 FROM curriculum_subtopics st
    WHERE st.topic_id = t.id AND st.slug = 'stereometrija'
  );

UPDATE task_bank_items
SET topic_id = (SELECT id FROM curriculum_topics WHERE grade = 4 AND slug = '4-geometrija' LIMIT 1),
    subtopic_id = (
      SELECT st.id FROM curriculum_subtopics st
      JOIN curriculum_topics t ON t.id = st.topic_id
      WHERE t.grade = 4 AND t.slug = '4-geometrija' AND st.slug = 'stereometrija'
      LIMIT 1
    ),
    updated_at = NOW()
WHERE topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 4 AND slug = '4-stereometrija-3d'
);

DELETE FROM curriculum_subtopics
WHERE topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 4 AND slug = '4-stereometrija-3d');

DELETE FROM curriculum_topics
WHERE grade = 4 AND slug = '4-stereometrija-3d';
