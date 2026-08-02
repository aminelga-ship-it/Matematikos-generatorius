/*
# Admin gali trinti feedback po užduoties patvirtinimo
*/

DROP POLICY IF EXISTS task_bank_feedback_admin_delete ON task_bank_feedback;
CREATE POLICY task_bank_feedback_admin_delete ON task_bank_feedback FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
