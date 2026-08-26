#!/bin/bash

# Script to set up QuickNote database in Supabase
# Run this after creating a new Supabase project

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}QuickNote Database Setup${NC}"
echo "=========================="
echo ""
echo "This script will help you set up the database schema for QuickNote."
echo ""
echo "Steps to complete:"
echo "1. Go to your Supabase project at https://supabase.com"
echo "2. Navigate to SQL Editor"
echo "3. Create a new query"
echo "4. Copy and paste the SQL below:"
echo ""
echo "------- BEGIN SQL -------"

cat << 'EOF'
-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime on notes table
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
EOF

echo ""
echo "------- END SQL -------"
echo ""
echo -e "${GREEN}✓ After running the SQL in Supabase, your database will be ready!${NC}"
echo ""
echo "Next steps:"
echo "1. Create a .env.local file with your Supabase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 and sign up!"
