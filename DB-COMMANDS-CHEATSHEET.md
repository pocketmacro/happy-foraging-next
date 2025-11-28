# Database Migration Cheatsheet

Quick reference for common database operations.

## 🚀 First-Time Setup

```bash
# 1. Link to Supabase (one-time)
npm run db:link

# 2. Apply all migrations
npm run db:push
```

## 📝 Creating New Migrations

### Create a new migration file
```bash
npm run db:migrate add_favorites_table
```
This creates: `supabase/migrations/TIMESTAMP_add_favorites_table.sql`

### Auto-generate from dashboard changes
```bash
npm run db:diff add_new_feature
```

## 🔄 Applying Changes

### Push local changes to Supabase
```bash
npm run db:push
```

### Pull remote changes to local
```bash
npm run db:pull
```

### Reset local database (testing only)
```bash
npm run db:reset
```

## 📋 Common Migration Examples

### Add a column
```sql
-- Migration: add_tags
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS tags TEXT[];
```

### Create a table
```sql
-- Migration: add_favorites
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  recipe_id BIGINT NOT NULL REFERENCES recipes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);
```

### Add an index
```sql
-- Migration: add_search_index
CREATE INDEX IF NOT EXISTS idx_recipes_search
ON recipes USING GIN(to_tsvector('english', title || ' ' || description));
```

### Update data
```sql
-- Migration: update_categories
UPDATE recipes
SET category = 'mains'
WHERE category = 'main';
```

## 🔧 Workflow

1. **Make a change**:
   ```bash
   npm run db:migrate your_change_name
   ```

2. **Edit the migration file** in `supabase/migrations/`

3. **Apply to database**:
   ```bash
   npm run db:push
   ```

4. **Test your change** - verify it works

5. **Commit to git** - migration files are version controlled!

## 💡 Pro Tips

- ✅ Always use `IF NOT EXISTS` / `IF EXISTS`
- ✅ Name migrations descriptively
- ✅ Test locally before pushing to production
- ✅ One logical change per migration
- ✅ Include RLS policies for new tables

## 🆘 Quick Troubleshooting

**"Failed to link"**
- Get database password from: Settings → Database → Connection String

**"Migration failed"**
- Check for typos in SQL
- Verify table/column doesn't already exist
- Use `IF NOT EXISTS` clauses

**"Cannot connect"**
- Check internet connection
- Verify project is active
- Run `npm run db:link` again

## 📚 Full Documentation

See [DATABASE-MIGRATIONS.md](./DATABASE-MIGRATIONS.md) for complete guide with examples.
