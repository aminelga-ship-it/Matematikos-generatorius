/*
# Pakartotinis Aibės sankirtos užduoties taisymas
# (jei 20260803111000 nepataikė dėl teksto skirtumų)
*/

UPDATE task_bank_items
SET
  question = 'Raskite dviženklių natūraliųjų skaičių, kurie dalijasi iš $7$, ir dviženklių skaičių, kurie baigiasi skaitmeniu $7$, aibių sankirtą.',
  answer = '$\{77\}$'
WHERE grade = 11
  AND generation_prompt = 'Seed: 11 kl. Aibės (manual)'
  AND difficulty = 'sunkios'
  AND (
    question ILIKE '%dalijasi iš $5$%'
    OR question ILIKE '%baigiasi skaitmeniu $1$%'
    OR answer LIKE '%\{51\}%'
    OR answer LIKE '%51%'
  );
