/*
# Sesijos „pagal temą“ — išsaugomos pasirinktos temos ir potemės
*/

ALTER TABLE math_sessions
  ADD COLUMN IF NOT EXISTS topic_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subtopic_ids uuid[] NOT NULL DEFAULT '{}';
