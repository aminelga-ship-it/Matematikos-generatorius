/*
# Svečio naudojimo skaitikliai + profilio dienos/mėnesio limitai (pagal planų aprašą)
*/

CREATE TABLE IF NOT EXISTS guest_usage (
  key text PRIMARY KEY,
  used_requests integer NOT NULL DEFAULT 0 CHECK (used_requests >= 0),
  used_tasks integer NOT NULL DEFAULT 0 CHECK (used_tasks >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE guest_usage ENABLE ROW LEVEL SECURITY;
-- Tik service role (Edge Functions) — viešų policy nėra

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS requests_today integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usage_day date,
  ADD COLUMN IF NOT EXISTS requests_month integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tasks_month integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usage_month text;
