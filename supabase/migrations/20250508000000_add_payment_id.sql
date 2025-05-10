-- Add payment_id column to order table
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS payment_id text;

-- Add index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON "order"(payment_id);

-- Create policy to allow users to view their orders
CREATE POLICY IF NOT EXISTS "Users can view orders with their payment_id" 
  ON "order" FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);