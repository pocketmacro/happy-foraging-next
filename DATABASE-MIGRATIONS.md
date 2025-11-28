# Database Migrations Guide

This project uses **Supabase CLI** for easy database migrations. No more copying SQL into the Supabase dashboard!

## 🚀 Quick Start

### First-Time Setup

1. **Link your local project to Supabase** (one-time setup):
   ```bash
   npm run db:link
   ```
   - This will ask for your database password
   - Find it in Supabase Dashboard → Settings → Database → Connection String
   - Look for the password in: `postgresql://postgres:[YOUR-PASSWORD]@...`

2. **Push the initial schema** to your database:
   ```bash
   npm run db:push
   ```
   - This applies all migrations in `supabase/migrations/` folder
   - Your database is now set up! ✅

## 📝 Making Database Changes

### Method 1: Write SQL Directly (Recommended for Simple Changes)

1. **Create a new migration**:
   ```bash
   npm run db:migrate add_new_column
   ```
   - This creates: `supabase/migrations/TIMESTAMP_add_new_column.sql`

2. **Edit the migration file**:
   ```sql
   -- Example: Add a new column
   ALTER TABLE recipes ADD COLUMN tags TEXT[];

   -- Example: Create a new table
   CREATE TABLE favorites (
     id BIGSERIAL PRIMARY KEY,
     user_id UUID NOT NULL,
     recipe_id BIGINT NOT NULL REFERENCES recipes(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Apply the migration**:
   ```bash
   npm run db:push
   ```

### Method 2: Auto-Generate from Schema Changes

If you make changes directly in Supabase dashboard:

1. **Pull changes from remote**:
   ```bash
   npm run db:pull
   ```
   - Creates a new migration with your remote changes

2. **Or generate a diff**:
   ```bash
   npm run db:diff new_migration_name
   ```
   - Compares local vs remote and creates migration

## 🔄 Common Workflows

### Adding a New Table

1. Create migration:
   ```bash
   npm run db:migrate add_favorites_table
   ```

2. Edit the file:
   ```sql
   CREATE TABLE IF NOT EXISTS favorites (
     id BIGSERIAL PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES auth.users(id),
     recipe_id BIGINT NOT NULL REFERENCES recipes(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, recipe_id)
   );

   -- Enable RLS
   ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

   -- Users can only see their own favorites
   CREATE POLICY "Users can view own favorites"
     ON favorites FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own favorites"
     ON favorites FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   ```

3. Apply:
   ```bash
   npm run db:push
   ```

### Adding a Column

1. Create migration:
   ```bash
   npm run db:migrate add_difficulty_level
   ```

2. Edit:
   ```sql
   ALTER TABLE recipes
   ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard'));
   ```

3. Apply:
   ```bash
   npm run db:push
   ```

### Updating Sample Data

1. Create migration:
   ```bash
   npm run db:migrate update_sample_recipes
   ```

2. Edit:
   ```sql
   UPDATE recipes
   SET difficulty = 'easy'
   WHERE id IN (1, 2);

   UPDATE recipes
   SET difficulty = 'medium'
   WHERE id IN (3, 4);
   ```

3. Apply:
   ```bash
   npm run db:push
   ```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:link` | Link local project to Supabase (one-time setup) |
| `npm run db:push` | Apply all pending migrations to remote database |
| `npm run db:pull` | Pull schema changes from remote database |
| `npm run db:migrate <name>` | Create a new empty migration file |
| `npm run db:diff <name>` | Generate migration from remote changes |
| `npm run db:reset` | Reset local database (useful for testing) |

## 📂 File Structure

```
supabase/
├── config.toml                              # Supabase configuration
└── migrations/
    ├── 20241128000000_initial_schema.sql    # Initial schema
    ├── 20241128120000_add_favorites.sql     # Example migration
    └── 20241128150000_add_tags.sql          # Another example
```

## ✅ Best Practices

### 1. **Always Create Migrations for Schema Changes**
   - Don't edit the database directly in production
   - Migrations provide a history of all changes
   - Easy to rollback if needed

### 2. **Name Migrations Descriptively**
   ```bash
   ✅ npm run db:migrate add_user_profiles
   ✅ npm run db:migrate remove_old_timestamps
   ❌ npm run db:migrate migration1
   ❌ npm run db:migrate fix
   ```

### 3. **Use IF NOT EXISTS / IF EXISTS**
   ```sql
   ✅ CREATE TABLE IF NOT EXISTS favorites (...)
   ✅ ALTER TABLE recipes ADD COLUMN IF NOT EXISTS tags TEXT[]
   ✅ DROP INDEX IF EXISTS old_index_name
   ```

### 4. **Include Both Up and Down Logic (Optional)**
   ```sql
   -- Migration: add_tags_column

   -- Up
   ALTER TABLE recipes ADD COLUMN IF NOT EXISTS tags TEXT[];

   -- Down (for rollback - optional)
   -- ALTER TABLE recipes DROP COLUMN IF EXISTS tags;
   ```

### 5. **Test Migrations Locally First**
   ```bash
   # Apply migration
   npm run db:push

   # If something goes wrong, you can reset
   npm run db:reset
   ```

## 🔒 Security Notes

### Never Commit These Files:
- `.env.local` (contains API keys)
- `supabase/.temp/` (temporary files)
- `supabase/.branches/` (branch-specific data)

### Safe to Commit:
- `supabase/config.toml` ✅
- `supabase/migrations/*.sql` ✅

## 🐛 Troubleshooting

### "Failed to link project"
- Make sure you have the correct database password
- Find it in: Supabase Dashboard → Settings → Database → Connection String

### "Migration failed: relation already exists"
- Use `IF NOT EXISTS` in your migrations
- Or check if the table/column was already created

### "Permission denied"
- Some operations require the service_role key
- Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=your_secret_key`

### "Cannot connect to database"
- Check your internet connection
- Verify your project is still active in Supabase dashboard
- Run `npm run db:link` again

## 📚 Migration Examples

### Example 1: Add Tags to Recipes

**File**: `supabase/migrations/20241128120000_add_recipe_tags.sql`
```sql
-- Add tags column
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for tag searches
CREATE INDEX IF NOT EXISTS idx_recipes_tags
ON recipes USING GIN(tags);

-- Update existing recipes with sample tags
UPDATE recipes
SET tags = ARRAY['foraged', 'seasonal']
WHERE category = 'salads';

UPDATE recipes
SET tags = ARRAY['foraged', 'dessert', 'chocolate']
WHERE category = 'desserts';
```

### Example 2: User Favorites System

**File**: `supabase/migrations/20241128130000_add_favorites.sql`
```sql
-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_favorites_user
ON favorites(user_id);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### Example 3: Add Recipe Ratings

**File**: `supabase/migrations/20241128140000_add_ratings.sql`
```sql
-- Create ratings table
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id BIGSERIAL PRIMARY KEY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ratings_recipe
ON recipe_ratings(recipe_id);

CREATE INDEX IF NOT EXISTS idx_ratings_user
ON recipe_ratings(user_id);

-- Enable RLS
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Public can read ratings
CREATE POLICY "Anyone can view ratings"
  ON recipe_ratings FOR SELECT
  USING (true);

-- Users can add their own ratings
CREATE POLICY "Users can insert own ratings"
  ON recipe_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
  ON recipe_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
  ON recipe_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_ratings_updated_at ON recipe_ratings;
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON recipe_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add average rating to recipes (materialized view or computed column)
-- Option 1: Add a function to calculate average rating
CREATE OR REPLACE FUNCTION get_recipe_avg_rating(recipe_id BIGINT)
RETURNS NUMERIC AS $$
  SELECT COALESCE(AVG(rating), 0)::NUMERIC(3,2)
  FROM recipe_ratings
  WHERE recipe_ratings.recipe_id = $1
$$ LANGUAGE SQL STABLE;
```

## 🎯 Next Steps

1. **Link your project** (if you haven't already):
   ```bash
   npm run db:link
   ```

2. **Push the initial schema**:
   ```bash
   npm run db:push
   ```

3. **Start making changes**:
   ```bash
   npm run db:migrate your_feature_name
   ```

That's it! You now have full control over your database schema with version control. 🎉
