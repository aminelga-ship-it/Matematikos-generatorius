/*
  5 kl. curriculum: dešimtainiai/procentai, reiškiniai/lygtys skaidymas, planimetrija
*/

-- Dešimtainiai sk. ir procentai: pašalinti potemę „Dešimtainiai skaičiai“
DELETE FROM curriculum_subtopics
WHERE slug = 'desimtainiai-skaiciai'
  AND topic_id IN (
    SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-desimtainiai-sk-ir-procentai'
  );

UPDATE curriculum_subtopics
SET title = 'Kas yra procentas? Jų pavertimas į trupmeną'
WHERE slug = 'procentai'
  AND topic_id IN (
    SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-desimtainiai-sk-ir-procentai'
  );

-- Reiškiniai ir lygtys → dvi atskiros temos
INSERT INTO curriculum_topics (grade, slug, title, sort_order) VALUES
  (5, '5-reiskiniai', 'Reiškiniai', 4),
  (5, '5-lygtys', 'Lygtys', 5);

UPDATE curriculum_subtopics
SET
  topic_id = (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai' LIMIT 1),
  slug = 'tolimesnio-skaiciaus-radimas-pagal-desninguma',
  title = 'Tolimesnio skaičiaus radimas pagal dėsningumą',
  sort_order = 1
WHERE slug = 'sekos'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys');

UPDATE curriculum_subtopics
SET
  topic_id = (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai' LIMIT 1),
  sort_order = 2
WHERE slug = 'raidiniai-reiskiniai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys');

UPDATE curriculum_subtopics
SET
  topic_id = (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-lygtys' LIMIT 1),
  slug = 'vieno-veiksmo-lygtys',
  title = 'Vieno veiksmo lygtys',
  sort_order = 1
WHERE slug = 'lygtys'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys');

UPDATE curriculum_subtopics
SET
  topic_id = (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-lygtys' LIMIT 1),
  sort_order = 2
WHERE slug = 'judejimo-uzdaviniai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys');

UPDATE task_bank_items
SET
  topic_id = (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai' LIMIT 1),
  updated_at = NOW()
WHERE topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys')
  AND subtopic_id IN (
    SELECT id FROM curriculum_subtopics
    WHERE slug IN ('tolimesnio-skaiciaus-radimas-pagal-desninguma', 'raidiniai-reiskiniai')
  );

UPDATE task_bank_items
SET
  topic_id = (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-lygtys' LIMIT 1),
  updated_at = NOW()
WHERE topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys')
  AND subtopic_id IN (
    SELECT id FROM curriculum_subtopics
    WHERE slug IN ('vieno-veiksmo-lygtys', 'judejimo-uzdaviniai')
  );

DELETE FROM curriculum_topics
WHERE grade = 5 AND slug = '5-reiskiniai-ir-lygtys';

-- Geometrija (2D) → Planimetrija
UPDATE curriculum_topics
SET title = 'Planimetrija', slug = '5-planimetrija', sort_order = 6
WHERE grade = 5 AND slug = '5-geometrija-2d';

UPDATE curriculum_subtopics
SET title = 'Trikampio kampų suma ir jo rūšys'
WHERE slug = 'kampai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 5 AND slug = '5-planimetrija');

UPDATE curriculum_topics
SET sort_order = 7
WHERE grade = 5 AND slug = '5-stereometrija-3d';
