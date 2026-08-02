/*
# LT geometrijos terminologija banko pilotuose (jei seed jau įvykdytas)
*/

UPDATE task_bank_items
SET
  question = replace(replace(replace(replace(replace(replace(replace(
    question,
    'Stačiojo trikampio', 'Statusio trikampio'),
    'stačiu trikampiu', 'statusiu trikampiu'),
    'diagonalės', 'įstrižainės'),
    'diagonalė', 'įstrižainė'),
    'Diagonalė', 'Įstrižainė'),
    'status trikampis', 'statusis trikampis'),
    'medianos', 'vidurio linijos'),
  answer = replace(replace(replace(replace(replace(replace(replace(
    answer,
    'Stačiojo trikampio', 'Statusio trikampio'),
    'diagonalės', 'įstrižainės'),
    'diagonalė', 'įstrižainė'),
    'Diagonalė', 'Įstrižainė'),
    'status trikampis', 'statusis trikampis'),
    'nestatus', 'nestatusis'),
    'Status;', 'Taip;'),
  solution = replace(replace(replace(replace(replace(replace(
    solution,
    'Stačiojo trikampio', 'Statusio trikampio'),
    'diagonalės', 'įstrižainės'),
    'diagonalė', 'įstrižainė'),
    'Diagonalė', 'Įstrižainė'),
    'status trikampis', 'statusis trikampis'),
    'Pusės diagonalės', 'Pusės įstrižainės'),
  updated_at = now()
WHERE generation_prompt = 'Pilot seed: 8 kl. geometrija (vadovėlis K21–K40, BP)';
