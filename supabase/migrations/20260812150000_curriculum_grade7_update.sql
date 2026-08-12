/*
  7 kl. curriculum: temų/potemių pervadinimai
*/

-- Laipsniai
UPDATE curriculum_subtopics
SET
  slug = 'laipsnis-su-neteigiamu-rodikliu',
  title = 'Laipsnis su neteigiamu rodikliu'
WHERE slug = 'laipsnis-su-sveikuoju-rodikliu'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-laipsniai');

-- Nelygybės
UPDATE curriculum_subtopics
SET
  slug = 'nelygybes-uzrasymas-intervale-ir-vaizdavimas-skaiciu-tieseje',
  title = 'Nelygybės užrašymas intervale ir vaizdavimas skaičių tiesėje'
WHERE slug = 'savybes-ir-intervalai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-nelygybes');

-- Geometrijos elementai
UPDATE curriculum_subtopics
SET
  slug = 'kryzminiai-gretutiniai-kampai-ir-priekampis',
  title = 'Kryžminiai, gretutiniai kampai ir priekampis'
WHERE slug = 'tiesiu-tarpusavio-padetys'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-geometrijos-elementai');

UPDATE curriculum_subtopics
SET
  slug = 'dvi-lygiagrecios-arba-ne-tieses-perkirstos-kirstine',
  title = 'Dvi lygiagrečios (arba ne) tiesės perkirstos kirstine'
WHERE slug = 'tiesiu-lygiagretumo-pozymiai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-geometrijos-elementai');

-- Keturkampiai
UPDATE curriculum_topics
SET title = 'Keturkampiai ir jų savybės'
WHERE grade = 7 AND slug = '7-keturkampiai';

UPDATE curriculum_subtopics
SET title = 'Trapecija ir jos vidurio linija'
WHERE slug = 'trapecija'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-keturkampiai');

UPDATE curriculum_subtopics
SET
  slug = 'asine-ir-centrine-simetrija',
  title = 'Ašinė ir centrinė simetrija'
WHERE slug = 'transformacijos'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-keturkampiai');

-- Plotai ir kiti dydžiai
UPDATE curriculum_subtopics
SET title = 'Trikampio plotas'
WHERE slug = 'trikampio'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-plotai-ir-kiti-dydziai');

UPDATE curriculum_subtopics
SET title = 'Lygiagretainio plotas'
WHERE slug = 'lygiagretainio'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-plotai-ir-kiti-dydziai');

UPDATE curriculum_subtopics
SET title = 'Trapecijos plotas'
WHERE slug = 'trapecijos'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 7 AND slug = '7-plotai-ir-kiti-dydziai');

-- Stereometrija (3D)
UPDATE curriculum_topics
SET
  title = 'Figūrų paviršiaus plotai ir tūriai',
  slug = '7-figuru-pavirsiaus-plotai-ir-turiai'
WHERE grade = 7 AND slug = '7-stereometrija-3d';

-- Finansiniai skaičiavimai
UPDATE curriculum_topics
SET title = 'Finansiniai skaičiavimai (procentiniai pokyčiai, biudžetas, paprastosios palūkanos, pirkinių palyginimai)'
WHERE grade = 7 AND slug = '7-finansiniai-skaiciavimai';
