/*
# Mokytojas gali pašalinti netinkamą juodraštį (feedback „netinkama“)
*/

DROP POLICY IF EXISTS task_bank_teacher_delete_draft ON task_bank_items;
CREATE POLICY task_bank_teacher_delete_draft ON task_bank_items FOR DELETE TO authenticated
  USING (
    status = 'draft'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
  );
