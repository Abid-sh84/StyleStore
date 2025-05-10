-- Add payment_method column if it doesn't exist
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS payment_method text;

-- Make payment_method nullable temporarily to handle existing orders
ALTER TABLE "order" ALTER COLUMN payment_method DROP NOT NULL;

-- Create policy to allow users to update payment_method on their orders
CREATE POLICY IF NOT EXISTS "Users can update payment_method on their orders" 
  ON "order" FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);