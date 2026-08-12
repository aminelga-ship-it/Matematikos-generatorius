/*
  1 kl. curriculum: trinamos temos, naujos potemės, banko auto-approved → draft
*/

-- Seni AI įrašai, patvirtinti generavimo metu (be atskiros peržiūros)
UPDATE task_bank_items
SET status = 'draft',
    reviewed_at = NULL,
    reviewed_by = NULL,
    updated_at = NOW()
WHERE status = 'approved'
  AND generation_prompt IS NOT NULL
  AND reviewed_by IS NOT NULL
  AND created_by IS NOT NULL
  AND reviewed_by = created_by;

DELETE FROM curriculum_subtopics
WHERE topic_id IN (
  SELECT id FROM curriculum_topics
  WHERE grade = 1
    AND slug IN (
      '1-zingsnis-i-pirmaja-klase',
      '1-matavimai',
      '1-duomenys-ir-desningumai'
    )
);

DELETE FROM curriculum_topics
WHERE grade = 1
  AND slug IN (
    '1-zingsnis-i-pirmaja-klase',
    '1-matavimai',
    '1-duomenys-ir-desningumai'
  );

DELETE FROM curriculum_subtopics
WHERE topic_id = (
  SELECT id FROM curriculum_topics
  WHERE grade = 1 AND slug = '1-skaiciai-iki-20'
  LIMIT 1
);

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, s.slug, s.title, s.ord
FROM curriculum_topics t
JOIN (VALUES
  ('sudetis', 'Sudėtis', 1),
  ('atimtis', 'Atimtis', 2),
  ('tekstiniai-uzdaviniai-ir-palyginimas', 'Tekstiniai uždaviniai ir palyginimas', 3)
) AS s(slug, title, ord) ON TRUE
WHERE t.grade = 1 AND t.slug = '1-skaiciai-iki-20';

UPDATE curriculum_subtopics
SET
  slug = 'vienazenkli-ir-dvizenkli-sudetis-ir-atimtis',
  title = 'Vienženklio ir dviženklio sudėtis ir atimtis'
WHERE topic_id = (
  SELECT id FROM curriculum_topics
  WHERE grade = 1 AND slug = '1-skaiciai-ir-veiksmai-iki-100'
  LIMIT 1
)
AND slug = 'pilnu-desimciu-sudetis-ir-atimtis';

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, 'dvizenkliu-skaiciu-sudetis-ir-atimtis', 'Dviženklių skaičių sudėtis ir atimtis', 4
FROM curriculum_topics t
WHERE t.grade = 1 AND t.slug = '1-skaiciai-ir-veiksmai-iki-100'
AND NOT EXISTS (
  SELECT 1 FROM curriculum_subtopics st
  WHERE st.topic_id = t.id AND st.slug = 'dvizenkliu-skaiciu-sudetis-ir-atimtis'
);
