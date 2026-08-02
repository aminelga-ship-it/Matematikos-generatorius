/*
# Užduočių bankas, curriculum, roles — pašalintas generation cache
*/

DROP TABLE IF EXISTS task_generation_cache;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role text CHECK (role IS NULL OR role IN ('teacher', 'student', 'admin'));

CREATE TABLE IF NOT EXISTS curriculum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade integer NOT NULL CHECK (grade BETWEEN 1 AND 12),
  slug text NOT NULL,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (grade, slug)
);

CREATE TABLE IF NOT EXISTS curriculum_subtopics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (topic_id, slug)
);

CREATE TYPE task_bank_status AS ENUM ('draft', 'approved', 'rejected');
CREATE TYPE task_bank_source AS ENUM ('ai_generated', 'manual', 'user_corrected');
CREATE TYPE bank_difficulty AS ENUM ('lengvos', 'vidutinės', 'sunkios');
CREATE TYPE task_feedback_type AS ENUM (
  'suitable',
  'fix_text',
  'fix_solution',
  'wrong_difficulty',
  'unsuitable'
);

CREATE TABLE IF NOT EXISTS task_bank_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade integer NOT NULL CHECK (grade BETWEEN 1 AND 12),
  topic_id uuid REFERENCES curriculum_topics(id) ON DELETE SET NULL,
  subtopic_id uuid REFERENCES curriculum_subtopics(id) ON DELETE SET NULL,
  difficulty bank_difficulty NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  solution text NOT NULL DEFAULT '',
  diagram_config jsonb,
  function_equation text,
  status task_bank_status NOT NULL DEFAULT 'draft',
  source task_bank_source NOT NULL DEFAULT 'ai_generated',
  generation_prompt text,
  usage_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_bank_savarankiskas
  ON task_bank_items (grade, status, subtopic_id, difficulty);

CREATE TABLE IF NOT EXISTS task_bank_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_bank_item_id uuid NOT NULL REFERENCES task_bank_items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type task_feedback_type NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_bank_feedback_item
  ON task_bank_feedback (task_bank_item_id);

-- Curriculum: public read
ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_subtopics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS curriculum_topics_read ON curriculum_topics;
CREATE POLICY curriculum_topics_read ON curriculum_topics FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS curriculum_subtopics_read ON curriculum_subtopics;
CREATE POLICY curriculum_subtopics_read ON curriculum_subtopics FOR SELECT TO anon, authenticated USING (true);

-- Bank: admin full access
ALTER TABLE task_bank_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_bank_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS task_bank_admin_all ON task_bank_items;
CREATE POLICY task_bank_admin_all ON task_bank_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS task_bank_teacher_update ON task_bank_items;
CREATE POLICY task_bank_teacher_update ON task_bank_items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')));

DROP POLICY IF EXISTS task_bank_creator_update ON task_bank_items;
CREATE POLICY task_bank_creator_update ON task_bank_items FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS task_bank_teacher_read ON task_bank_items;
CREATE POLICY task_bank_teacher_read ON task_bank_items FOR SELECT TO authenticated
  USING (
    status = 'approved'
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin'))
  );

DROP POLICY IF EXISTS task_bank_feedback_insert ON task_bank_feedback;
CREATE POLICY task_bank_feedback_insert ON task_bank_feedback FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin'))
  );

DROP POLICY IF EXISTS task_bank_feedback_read ON task_bank_feedback;
CREATE POLICY task_bank_feedback_read ON task_bank_feedback FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin'))
  );

-- Placeholder curriculum (vėliau redaguokite rankiniu būdu)
INSERT INTO curriculum_topics (grade, slug, title, sort_order) VALUES
  (5, 'naturalieji-sk', 'Natūralieji skaičiai', 1),
  (5, 'trupmenos', 'Trupmenos', 2),
  (7, 'algebra', 'Algebra', 1),
  (7, 'geometrija', 'Geometrija', 2),
  (8, 'lygtys', 'Lygtys ir nelygybės', 1),
  (8, 'funkcijos', 'Funkcijos', 2),
  (9, 'pitagoras', 'Pitagoro teorema', 1),
  (9, 'kvadratinės', 'Kvadratinės lygtys', 2)
ON CONFLICT (grade, slug) DO NOTHING;

INSERT INTO curriculum_subtopics (topic_id, slug, title, sort_order)
SELECT t.id, s.slug, s.title, s.ord FROM curriculum_topics t
JOIN (VALUES
  ('naturalieji-sk', 'sandauga', 'Sandauga ir dalyba', 1),
  ('naturalieji-sk', 'tekstiniai', 'Tekstiniai uždaviniai', 2),
  ('trupmenos', 'sudetis', 'Trupmenų sudėtis', 1),
  ('trupmenos', 'palyginimas', 'Trupmenų palyginimas', 2),
  ('algebra', 'lygtys', 'Tiesinės lygtys', 1),
  ('algebra', 'reiskiniai', 'Algebriniai reiškiniai', 2),
  ('geometrija', 'trikampiai', 'Trikampiai', 1),
  ('geometrija', 'kampai', 'Kampai ir lygiagretės', 2),
  ('lygtys', 'linear', 'Tiesinės lygtys', 1),
  ('lygtys', 'sistemos', 'Lygčių sistemos', 2),
  ('funkcijos', 'grafikai', 'Funkcijų grafikai', 1),
  ('funkcijos', 'tiesine', 'Tiesinė funkcija', 2),
  ('pitagoras', 'statinis', 'Statini trikampiai', 1),
  ('pitagoras', 'koordinates', 'Koordinatėse', 2),
  ('kvadratinės', 'sprendimas', 'Lygčių sprendimas', 1),
  ('kvadratinės', 'diskriminantas', 'Diskriminantas', 2)
) AS s(topic_slug, slug, title, ord) ON t.slug = s.topic_slug
ON CONFLICT (topic_id, slug) DO NOTHING;
