/*
# Kurioms banko užduotims vartotojas jau gavo (pagal temą) — vengti kartojimų
*/

CREATE TABLE IF NOT EXISTS user_bank_deliveries (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_bank_item_id uuid NOT NULL REFERENCES task_bank_items(id) ON DELETE CASCADE,
  delivered_at timestamptz NOT NULL DEFAULT now(),
  delivery_count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, task_bank_item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_bank_deliveries_user_delivered
  ON user_bank_deliveries (user_id, delivered_at DESC);

ALTER TABLE user_bank_deliveries ENABLE ROW LEVEL SECURITY;
