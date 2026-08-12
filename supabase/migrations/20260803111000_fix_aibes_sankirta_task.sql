/*
# Klaidos taisymas: 11 kl. Aibės sunkioje užduotyje sankirta buvo tuščia
# (iš 5 besidalijantys skaičiai baigiasi 0 arba 5, todėl atsakymas {51} buvo klaidingas).
*/

UPDATE task_bank_items
SET
  question = 'Raskite dviženklių natūraliųjų skaičių, kurie dalijasi iš $7$, ir dviženklių skaičių, kurie baigiasi skaitmeniu $7$, aibių sankirtą.',
  answer = '$\{77\}$'
WHERE generation_prompt = 'Seed: 11 kl. Aibės (manual)'
  AND question = 'Raskite dviženklių natūraliųjų skaičių, kurie dalijasi iš $5$, ir dviženklių skaičių, kurie baigiasi skaitmeniu $1$, aibių sankirtą.';
