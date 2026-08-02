/*
# task_generation_cache — globalus AI generavimo kešas

Raktas: klasė + sunkumas + užduočių sk. + normalizuota tema + diagrama/grafikas/sprendimai.
Edge Function (service role) skaito/rašo; viešos politikos nėra.
*/

CREATE TABLE IF NOT EXISTS task_generation_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL UNIQUE,
  grade integer NOT NULL CHECK (grade BETWEEN 1 AND 12),
  difficulty text NOT NULL,
  task_count integer NOT NULL CHECK (task_count BETWEEN 1 AND 30),
  prompt_normalized text NOT NULL,
  with_diagram boolean NOT NULL DEFAULT false,
  with_graph boolean NOT NULL DEFAULT false,
  with_solution boolean NOT NULL DEFAULT false,
  tasks jsonb NOT NULL,
  hit_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_hit_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_task_generation_cache_lookup
  ON task_generation_cache (grade, difficulty, task_count, prompt_normalized);

ALTER TABLE task_generation_cache ENABLE ROW LEVEL SECURITY;
