-- Rename orders table to order
ALTER TABLE IF EXISTS orders RENAME TO "order";

-- Update foreign key constraints in order_items table
ALTER TABLE order_items 
  DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
  ADD CONSTRAINT order_items_order_id_fkey 
    FOREIGN KEY (order_id) 
    REFERENCES "order"(id);

-- Update RLS policies
ALTER POLICY "Users can view own orders" ON "order"
  RENAME TO "Users can view own order";

ALTER POLICY "Users can create orders" ON "order"
  RENAME TO "Users can create order";