-- Protocol Notes Database Schema

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notes table (one note per category)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL UNIQUE REFERENCES categories(id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_notes_category_id ON notes(category_id);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Categories: user can only access their own
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Notes: user can only access notes for their categories
CREATE POLICY "Users can view notes for own categories" ON notes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM categories WHERE categories.id = notes.category_id AND categories.user_id = auth.uid())
  );

CREATE POLICY "Users can insert notes for own categories" ON notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM categories WHERE categories.id = notes.category_id AND categories.user_id = auth.uid())
  );

CREATE POLICY "Users can update notes for own categories" ON notes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM categories WHERE categories.id = notes.category_id AND categories.user_id = auth.uid())
  );

CREATE POLICY "Users can delete notes for own categories" ON notes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM categories WHERE categories.id = notes.category_id AND categories.user_id = auth.uid())
  );
