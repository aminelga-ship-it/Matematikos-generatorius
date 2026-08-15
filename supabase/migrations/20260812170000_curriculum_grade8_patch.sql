/*
  8 kl. curriculum: lygtis, šaknų potemė, vektorių potemių šalinimas
*/

UPDATE curriculum_subtopics
SET
  slug = 'lygtis-su-dviem-nezinomaisiais',
  title = 'Lygtis su dviem nežinomaisiais'
WHERE slug = 'lygtis-ax-by-c'
  AND topic_id IN (
    SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-tiesines-lygciu-sistemos'
  );

UPDATE curriculum_subtopics
SET
  slug = 'panasiuju-saknu-sudetis-ir-atimtis',
  title = 'Panašiųjų šaknų sudėtis ir atimtis'
WHERE slug = 'saknu-su-vienodais-posakniais-sudetis-ir-atimtis'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

DELETE FROM curriculum_subtopics
WHERE topic_id IN (
  SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-vektoriai-geometrijoje'
);
