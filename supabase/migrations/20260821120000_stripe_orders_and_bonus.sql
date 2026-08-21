/*
  Stripe užsakymai ir PRO papildomų limitų kreditai.
*/

CREATE TABLE IF NOT EXISTS stripe_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_session_id text NOT NULL UNIQUE,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  stripe_customer_id text,
  plan text NOT NULL,
  amount_total integer,
  currency text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stripe_orders_user_id_idx ON stripe_orders (user_id);
CREATE INDEX IF NOT EXISTS stripe_orders_created_at_idx ON stripe_orders (created_at DESC);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_stripe_orders" ON stripe_orders;
CREATE POLICY "select_own_stripe_orders" ON stripe_orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS plan_expires_at date,
  ADD COLUMN IF NOT EXISTS bonus_requests integer NOT NULL DEFAULT 0 CHECK (bonus_requests >= 0),
  ADD COLUMN IF NOT EXISTS bonus_tasks integer NOT NULL DEFAULT 0 CHECK (bonus_tasks >= 0),
  ADD COLUMN IF NOT EXISTS bonus_secondary integer NOT NULL DEFAULT 0 CHECK (bonus_secondary >= 0);
