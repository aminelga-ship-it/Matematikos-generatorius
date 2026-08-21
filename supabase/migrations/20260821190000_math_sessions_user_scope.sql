/*
  math_sessions — kiekvienas vartotojas mato tik savo generacijų istoriją.
*/

ALTER TABLE math_sessions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS math_sessions_user_id_created_at_idx
  ON math_sessions (user_id, created_at DESC);

DROP POLICY IF EXISTS "anon_select_math_sessions" ON math_sessions;
DROP POLICY IF EXISTS "anon_insert_math_sessions" ON math_sessions;
DROP POLICY IF EXISTS "anon_update_math_sessions" ON math_sessions;
DROP POLICY IF EXISTS "anon_delete_math_sessions" ON math_sessions;

DROP POLICY IF EXISTS "select_own_math_sessions" ON math_sessions;
CREATE POLICY "select_own_math_sessions" ON math_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_math_sessions" ON math_sessions;
CREATE POLICY "insert_own_math_sessions" ON math_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_math_sessions" ON math_sessions;
CREATE POLICY "update_own_math_sessions" ON math_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_math_sessions" ON math_sessions;
CREATE POLICY "delete_own_math_sessions" ON math_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
