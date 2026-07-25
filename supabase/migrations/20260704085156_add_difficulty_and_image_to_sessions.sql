/*
# Add difficulty and image_data columns to math_sessions

1. Modified Tables
- `math_sessions`
  - Added `difficulty` (text): 'lengvos' | 'vidutinės' | 'sunkios'
  - Added `image_data` (text, nullable): base64-encoded image uploaded by user

2. Notes
- No data is dropped; existing rows get NULL for new columns.
- Policies unchanged (already cover anon + authenticated).
*/

ALTER TABLE math_sessions
  ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'vidutinės',
  ADD COLUMN IF NOT EXISTS image_data text;
