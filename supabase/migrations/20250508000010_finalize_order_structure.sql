-- Ensure all required columns exist with proper types
ALTER TABLE "order" ALTER COLUMN payment_method SET NOT NULL;
ALTER TABLE "order" ALTER COLUMN status SET NOT NULL;
ALTER TABLE "order" ALTER COLUMN total_amount SET NOT NULL;
ALTER TABLE "order" ALTER COLUMN shipping_address_id SET NOT NULL;

-- Add created_at and updated_at if they don't exist
ALTER TABLE "order" 
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_order_user_id ON "order"(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
CREATE INDEX IF NOT EXISTS idx_order_created_at ON "order"(created_at);

-- Ensure order_items constraints
ALTER TABLE order_items ALTER COLUMN quantity SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN price SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN product_id SET NOT NULL;

-- Add created_at and updated_at to order_items if they don't exist
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';