-- Add missing DELETE policy for ingredients table
CREATE POLICY "Authenticated users can delete ingredients"
    ON ingredients FOR DELETE
    USING (auth.role() = 'authenticated');
