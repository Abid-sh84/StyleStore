-- Disable RLS temporarily to refresh policies
ALTER TABLE "order" DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create order" ON "order";
DROP POLICY IF EXISTS "Users can view own order" ON "order";
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

-- Create policies for order table
CREATE POLICY "Users can create order"
  ON "order"
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order"
  ON "order"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for order_items table
CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "order"
      WHERE "order".id = order_items.order_id
      AND "order".user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own order items"
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

-- Add update policies
CREATE POLICY "Users can update their own order"
  ON "order"
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "order"
      WHERE "order".id = order_items.order_id
      AND "order".user_id = auth.uid()
    )
  );

-- Add delete policies
CREATE POLICY "Users can delete their own order"
  ON "order"
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own order items"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "order"
      WHERE "order".id = order_items.order_id
      AND "order".user_id = auth.uid()
    )
  );