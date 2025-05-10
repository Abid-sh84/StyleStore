-- Add email column and preferences jsonb column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{"newsletter": false, "notifications": {"email": true, "push": true}}'::jsonb;

-- Drop individual notification columns as they're now part of the preferences jsonb
ALTER TABLE profiles DROP COLUMN IF EXISTS newsletter;
ALTER TABLE profiles DROP COLUMN IF EXISTS email_notifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS push_notifications;

-- Update existing profiles to include email from auth.users
UPDATE profiles 
SET email = (
  SELECT email 
  FROM auth.users 
  WHERE users.id = profiles.id
);

-- Update handle_new_user function to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, email, preferences)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    '{"newsletter": false, "notifications": {"email": true, "push": true}}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;