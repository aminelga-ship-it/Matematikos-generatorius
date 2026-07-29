/*
# Add full_name to profiles and capture from OAuth metadata

1. Modified Tables
- `profiles`
  - Added `full_name` (text, nullable) — the user's display name from Google OAuth

2. Modified Functions
- `handle_new_user()` — now also captures full_name from raw_user_meta_data
  (Google sends full_name and given_name in user metadata)

3. Notes
- Existing profile rows get NULL for full_name; they'll be backfilled separately.
- The trigger fires on new signups; existing users are backfilled via SQL.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name text;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  display_name text;
BEGIN
  display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'given_name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, display_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);

  RETURN NEW;
END;
$$;
