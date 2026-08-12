/*
  6 kl. curriculum: temų/potemių pervadinimai ir šalinimai
*/

-- Sveikieji skaičiai → Neigiami skaičiai
UPDATE curriculum_topics
SET title = 'Neigiami skaičiai', slug = '6-neigiami-skaiciai'
WHERE grade = 6 AND slug = '6-sveikieji-skaiciai';

-- Racionalieji skaičiai → Trupmenos ir jų vertimas
UPDATE curriculum_topics
SET title = 'Trupmenos ir jų vertimas', slug = '6-trupmenos-ir-ju-vertimas'
WHERE grade = 6 AND slug = '6-racionalieji-skaiciai';

UPDATE curriculum_subtopics
SET
  slug = 'paprastuju-trupmenu-prastinimas-bendravardiklinimas-palyginimas',
  title = 'Paprastųjų trupmenų prastinimas, bendravardiklinimas ir palyginimas',
  sort_order = 1
WHERE slug = 'racionalieji-skaiciai-ir-ju-palyginimas'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-trupmenos-ir-ju-vertimas');

UPDATE curriculum_subtopics
SET
  slug = 'desimtainiu-ir-paprastuju-trupmenu-pavertimas',
  title = 'Dešimtainių ir paprastųjų trupmenų pavertimas',
  sort_order = 2
WHERE slug = 'trupmena-kaip-dalmuo'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-trupmenos-ir-ju-vertimas');

UPDATE curriculum_subtopics
SET
  slug = 'periodiniai-skaiciai',
  title = 'Periodiniai skaičiai',
  sort_order = 3
WHERE slug = 'begaliniai-skaiciai'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-trupmenos-ir-ju-vertimas');

-- Veiksmai su racionaliaisiais sk. → Veiksmai su paprastosiomis trupmenomis ir mišriaisiais skaičiais
UPDATE curriculum_topics
SET
  title = 'Veiksmai su paprastosiomis trupmenomis ir mišriaisiais skaičiais',
  slug = '6-veiksmai-su-paprastosiomis-trupmenomis-ir-misriaisiais-sk'
WHERE grade = 6 AND slug = '6-veiksmai-su-racionaliaisiais-sk';

DELETE FROM curriculum_subtopics
WHERE slug = 'tekstiniai-uzdaviniai'
  AND topic_id IN (
    SELECT id FROM curriculum_topics
    WHERE grade = 6 AND slug = '6-veiksmai-su-paprastosiomis-trupmenomis-ir-misriaisiais-sk'
  );

-- Tiesioginis proporcingumas: potemės pavadinimas
UPDATE curriculum_subtopics
SET
  slug = 'ar-dydziai-tiesiogiai-proporcingi',
  title = 'Ar dydžiai tiesiogiai proporcingi?'
WHERE slug = 'tiesiogiai-proporcingi-dydziai-ir-ju-grafikas'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-tiesioginis-proporcingumas');

-- Finansiniai skaičiavimai (tema be potemių)
UPDATE curriculum_topics
SET title = 'Finansiniai skaičiavimai (nuolaidos, pabrangimas, pelnas...)'
WHERE grade = 6 AND slug = '6-finansiniai-skaiciavimai';

-- Duomenys ir tikimybės: pašalinti Diagramos
DELETE FROM curriculum_subtopics
WHERE slug = 'diagramos'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-duomenys-ir-tikimybes');

UPDATE curriculum_subtopics
SET sort_order = 3
WHERE slug = 'galimybiu-medis'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-duomenys-ir-tikimybes');

UPDATE curriculum_subtopics
SET sort_order = 4
WHERE slug = 'daugybos-taisykle'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-duomenys-ir-tikimybes');

UPDATE curriculum_subtopics
SET sort_order = 5
WHERE slug = 'tiketinumas'
  AND topic_id IN (SELECT id FROM curriculum_topics WHERE grade = 6 AND slug = '6-duomenys-ir-tikimybes');
