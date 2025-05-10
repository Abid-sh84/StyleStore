-- Enable Row Level Security on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own order items
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

-- Allow users to view their own order items
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

-- Allow users to update their own order items
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

-- Allow users to delete their own order items
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

-- Add foreign key constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'order_items' 
    AND constraint_name = 'order_items_order_id_fkey'
  ) THEN
    ALTER TABLE order_items
      ADD CONSTRAINT order_items_order_id_fkey
      FOREIGN KEY (order_id)
      REFERENCES "order"(id)
      ON DELETE CASCADE;
  END IF;
END $$;