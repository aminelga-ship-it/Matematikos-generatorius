/*
# Pilot geometrija: lengvos/vidutinės be sprendimų (tik sunkios palieka solution)
*/

UPDATE task_bank_items
SET solution = '', updated_at = now()
WHERE generation_prompt = 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)'
  AND difficulty IN ('lengvos', 'vidutinės');
