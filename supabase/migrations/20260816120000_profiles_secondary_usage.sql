-- Antriniai generavimai: patikra, atsakymai, sprendimai (mėnesio skaitiklis)

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS secondary_month integer NOT NULL DEFAULT 0;
