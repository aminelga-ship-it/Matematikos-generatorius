/*
  8 kl. curriculum: šaknys, vektoriai, finansai, reiškiniai, planimetrija, sąryšiai, sistemos, stereometrija
*/

-- Šaknys
UPDATE curriculum_subtopics
SET title = 'Kvadratinės šaknies traukimas'
WHERE slug = 'kvadratine-saknis'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics
SET title = 'Kūbinės šaknies traukimas'
WHERE slug = 'kubine-saknis'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics
SET
  slug = 'iracionaliuju-skaiciu-atpazinimas-ivertinimas-palyginimas',
  title = 'Iracionaliųjų skaičių atpažinimas, įvertinimas ir palyginimas'
WHERE slug = 'iracionalieji-skaiciai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

DELETE FROM curriculum_subtopics
WHERE slug = 'palyginimas'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics
SET
  slug = 'saknu-su-vienodais-posakniais-sudetis-ir-atimtis',
  title = 'Šaknų su vienodais pošakniais sudėtis ir atimtis',
  sort_order = 4
WHERE slug = 'sudetis-ir-atimtis'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics
SET sort_order = 5
WHERE slug = 'daugyba'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics
SET
  slug = 'saknis-is-trupmenu-ir-misriuju-skaiciu',
  title = 'Šaknis iš trupmenų ir mišriųjų skaičių',
  sort_order = 6
WHERE slug = 'saknis-is-trupmenos'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics SET sort_order = 7
WHERE slug = 'ikelimas-i-sakni-ir-iskelimas'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics SET sort_order = 8
WHERE slug = 'skaitiniai-reiskiniai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

UPDATE curriculum_subtopics SET sort_order = 9
WHERE slug = 'raidiniai-reiskiniai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-saknys');

-- Vektoriai
UPDATE curriculum_topics
SET title = 'Vektoriai geometrijoje', slug = '8-vektoriai-geometrijoje'
WHERE grade = 8 AND slug = '8-vektoriai';

UPDATE curriculum_subtopics
SET
  slug = 'geometrine-sudetis-ir-atimtis',
  title = 'Geometrinė sudėtis ir atimtis'
WHERE slug = 'sudetis-ir-atimtis'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-vektoriai-geometrijoje');

UPDATE curriculum_subtopics
SET
  slug = 'vektoriaus-daugyba-is-skaiciaus',
  title = 'Vektoriaus daugyba iš skaičiaus'
WHERE slug = 'daugyba'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-vektoriai-geometrijoje');

-- Finansiniai skaičiavimai → 4 potemės
INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, s.slug, s.title, s.ord
FROM curriculum_topics t
JOIN (VALUES
  ('nuolaidos-antkainiai-ir-pvm-skaiciavimai', 'Nuolaidos, antkainiai ir PVM skaičiavimai', 1),
  ('biudzetas-pajamos-islaidos-santaupos-paprastos-palukanos', 'Biudžetas, pajamos ir išlaidos, santaupos, paprastos palūkanos', 2),
  ('valiutu-keitimas-ir-kurso-skaiciavimai', 'Valiutų keitimas ir kurso skaičiavimai', 3),
  ('pirkiniu-kainu-palyginimas-ir-pirkimas-isimoketinai', 'Pirkinių kainų palyginimas ir pirkimas išsimokėtinai', 4)
) AS s(slug, title, ord) ON true
WHERE t.grade = 8 AND t.slug = '8-finansiniai-skaiciavimai'
  AND NOT EXISTS (
    SELECT 1 FROM curriculum_subtopics st WHERE st.topic_id = t.id
  );

-- Reiškiniai
UPDATE curriculum_subtopics
SET title = 'Raidiniai reiškiniai su skliaustais'
WHERE slug = 'raidiniai-reiskiniai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-reiskiniai');

UPDATE curriculum_subtopics
SET
  slug = 'skaidymas-dauginamaisiais-keliant-pries-skliaustus',
  title = 'Skaidymas dauginamaisiais keliant prieš skliaustus ir naudojant greitosios daugybos formulę'
WHERE slug = 'skaidymas-dauginamaisiais'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-reiskiniai');

-- Geometrija → Planimetrija
UPDATE curriculum_topics
SET title = 'Planimetrija', slug = '8-planimetrija'
WHERE grade = 8 AND slug = '8-geometrija';

UPDATE curriculum_subtopics
SET title = 'Pitagoro teorema ir jos taikymas'
WHERE slug = 'pitagoro-teorema'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-planimetrija');

UPDATE curriculum_subtopics
SET
  slug = 'trikampio-ir-trapecijos-vidurio-linijos',
  title = 'Trikampio ir trapecijos vidurio linijos'
WHERE slug = 'vidurio-linija'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-planimetrija');

UPDATE curriculum_subtopics
SET
  slug = 'lygiasonio-ir-lygiakrascio-trikampio-savybes',
  title = 'Lygiašonio ir lygiakraščio trikampio savybės ($30°$, $60°$ kampo statinis)'
WHERE slug = 'trikampiai-ir-ju-savybes'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-planimetrija');

UPDATE curriculum_subtopics
SET
  slug = 'ivairiu-figuru-elementu-ilgiu-bei-plotu-skaiciavimas',
  title = 'Įvairių figūrų elementų ilgių bei plotų skaičiavimas'
WHERE slug = 'perimetrai-ir-plotai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-planimetrija');

-- Sąryšiai → dvi potemės
INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, s.slug, s.title, s.ord
FROM curriculum_topics t
JOIN (VALUES
  ('tiesioginis-proporcingumas', 'Tiesioginis proporcingumas', 1),
  ('atvirkstinis-proporcingumas', 'Atvirkštinis proporcingumas', 2)
) AS s(slug, title, ord) ON true
WHERE t.grade = 8 AND t.slug = '8-sarysiai'
  AND NOT EXISTS (
    SELECT 1 FROM curriculum_subtopics st WHERE st.topic_id = t.id
  );

-- Lygčių sistemos
UPDATE curriculum_topics
SET title = 'Tiesinės lygčių sistemos', slug = '8-tiesines-lygciu-sistemos'
WHERE grade = 8 AND slug = '8-lygciu-sistemos';

UPDATE curriculum_subtopics
SET
  slug = 'lygtis-ax-by-c',
  title = 'Lygtis $ax+by=c$'
WHERE slug = 'lygtis-su-dviem-nezinomaisiais'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-tiesines-lygciu-sistemos');

UPDATE curriculum_subtopics
SET
  slug = 'sistemos-sprendiniu-tikrinimas',
  title = 'Sistemos sprendinių tikrinimas'
WHERE slug = 'sistemu-sprendiniai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 8 AND slug = '8-tiesines-lygciu-sistemos');

-- Stereometrija (3D)
UPDATE curriculum_topics
SET
  title = 'Erdvinių figūrų paviršiaus plotai ir tūriai',
  slug = '8-erdvinu-figuru-pavirsiaus-plotai-ir-turiai'
WHERE grade = 8 AND slug = '8-stereometrija-3d';
