/*
# Create math_sessions table

1. New Tables
- `math_sessions`
  - `id` (uuid, primary key)
  - `grade` (integer, 1-12)
  - `task_count` (integer)
  - `prompt` (text, the user's description or example task)
  - `tasks` (jsonb, array of generated tasks with answers/solutions)
  - `created_at` (timestamp)

2. Security
- Enable RLS on `math_sessions`.
- Allow anon + authenticated CRUD (no login required app).
*/

CREATE TABLE IF NOT EXISTS math_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade integer NOT NULL CHECK (grade BETWEEN 1 AND 12),
  task_count integer NOT NULL CHECK (task_count BETWEEN 1 AND 30),
  prompt text NOT NULL,
  tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE math_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_math_sessions" ON math_sessions;
CREATE POLICY "anon_select_math_sessions" ON math_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_math_sessions" ON math_sessions;
CREATE POLICY "anon_insert_math_sessions" ON math_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_math_sessions" ON math_sessions;
CREATE POLICY "anon_update_math_sessions" ON math_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_math_sessions" ON math_sessions;
CREATE POLICY "anon_delete_math_sessions" ON math_sessions FOR DELETE
  TO anon, authenticated USING (true);
