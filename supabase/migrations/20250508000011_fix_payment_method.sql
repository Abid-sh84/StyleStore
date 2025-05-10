-- Add payment_method column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'order' 
        AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE "order" ADD COLUMN payment_method text NOT NULL DEFAULT 'card';
    END IF;
END $$;

-- Ensure the column is not null
ALTER TABLE "order" ALTER COLUMN payment_method SET NOT NULL;

-- Set a default value for any null values
UPDATE "order" SET payment_method = 'card' WHERE payment_method IS NULL;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';