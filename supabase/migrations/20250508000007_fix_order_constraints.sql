-- Drop existing constraints
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

-- Recreate the foreign key constraint with the correct table name
ALTER TABLE order_items 
  ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) 
  REFERENCES "order"(id)
  ON DELETE CASCADE;

-- Update existing policies to use the correct table name
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "order"
      WHERE "order".id = order_items.order_id
      AND "order".user_id = auth.uid()
    )
  );

-- Refresh the RLS policies
ALTER TABLE "order" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;