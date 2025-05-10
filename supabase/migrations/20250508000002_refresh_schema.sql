-- Refresh the schema cache
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Ensure the shipping_address_id column exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id uuid REFERENCES addresses(id);

-- Add RLS policy for orders
CREATE POLICY IF NOT EXISTS "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);