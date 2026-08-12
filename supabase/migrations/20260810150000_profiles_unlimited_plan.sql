/*
  Planas unlimited — neriboti limitai, visos PRO funkcijos.
*/

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('free', 'pro', 'unlimited'));
