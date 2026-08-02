-- Redaguojamas generavimo vadovo turinys (JSON)
CREATE TABLE IF NOT EXISTS app_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id)
);

ALTER TABLE app_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS app_content_select ON app_content;
CREATE POLICY app_content_select ON app_content FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS app_content_admin_write ON app_content;
CREATE POLICY app_content_admin_write ON app_content FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
