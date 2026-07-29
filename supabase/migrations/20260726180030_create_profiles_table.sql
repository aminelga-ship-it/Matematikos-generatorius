/*
# Create profiles table

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, nullable — copied from auth.users on signup)
  - `plan` (text, default 'free' — 'free' or 'pro')
  - `used_requests` (integer, default 0 — request counter)
  - `used_tasks` (integer, default 0 — task counter)
  - `created_at` (timestamptz, default now())

2. New Functions
- `handle_new_user()` — trigger function that automatically creates a profile row
  when a new user signs up via Supabase Auth (email or OAuth).

3. New Triggers
- `on_auth_user_created` — fires after a new user is inserted into auth.users,
  calling handle_new_user() to auto-create the matching profile row.

4. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can only read and update their own profile row.
- SELECT, INSERT, UPDATE policies scoped to auth.uid() = id.
- No DELETE policy (profiles should not be deletable via anon key).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  used_requests integer NOT NULL DEFAULT 0,
  used_tasks integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create a profile row when a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
