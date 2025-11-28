# URL Slug Feature for SEO

I've added SEO-friendly URL slugs to recipes! Now recipes have beautiful, human-readable URLs instead of just numeric IDs.

## ✨ What Changed

### Before
```
/recipes/1
/recipes/2
/recipes/3
```

### After
```
/recipes/dandelion-green-salad
/recipes/wild-berry-chocolate-bark
/recipes/roasted-vegetables-almond-crackers
```

## 🎯 Benefits

1. **Better SEO**: Search engines prefer descriptive URLs
2. **User-Friendly**: Users can understand what the recipe is from the URL
3. **Shareable**: URLs are more memorable and professional
4. **Backwards Compatible**: Old numeric URLs still work (e.g., `/recipes/1`)

## 📝 How It Works

### Auto-Generation

When you create a new recipe in the admin panel:

1. Type the recipe title (e.g., "Wild Berry Chocolate Bark")
2. The slug is **automatically generated** (`wild-berry-chocolate-bark`)
3. You can edit the slug if you want to customize it
4. The slug is validated to be URL-safe

### Slug Generation Rules

The `generateSlug()` function:
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Handles multiple hyphens
- Removes leading/trailing hyphens

**Examples:**
```typescript
generateSlug("Wild Berry Chocolate Bark")
// → "wild-berry-chocolate-bark"

generateSlug("Dandelion Green Salad!")
// → "dandelion-green-salad"

generateSlug("Roasted  Vegetables  &  Crackers")
// → "roasted-vegetables-crackers"
```

## 🗄️ Database Changes

### New Field

Added `slug` column to `recipes` table:
```sql
slug TEXT UNIQUE  -- URL-friendly version of title for SEO
```

### Unique Constraint

Slugs must be unique - no two recipes can have the same slug.

### Index

Added database index for fast slug lookups:
```sql
CREATE INDEX idx_recipes_slug ON recipes(slug);
```

## 💻 Code Changes

### 1. Utility Function

Created `lib/utils.ts` with:
- `generateSlug(text: string)` - Converts text to URL-safe slug
- `generateUniqueSlug()` - Ensures uniqueness
- `isValidSlug()` - Validates slug format

### 2. Supabase Functions

Added to `lib/supabase.ts`:
```typescript
getRecipeBySlug(slug: string)  // Get recipe by slug
```

Updated Recipe type to include `slug` field.

### 3. Admin Panel

**Recipe Form (`app/admin/recipes/page.tsx`)**:
- Added slug field to form
- Auto-generates slug when typing title
- Shows preview: "URL will be: /recipes/your-slug"
- Manual override available

**Auto-Generation Logic**:
```typescript
onChange={(e) => {
  const title = e.target.value
  // Auto-generate slug for new recipes
  if (!editingRecipe) {
    setFormData({ ...formData, title, slug: generateSlug(title) })
  } else {
    setFormData({ ...formData, title })
  }
}}
```

### 4. Recipe Routes

**Changed**: `app/recipes/[id]/page.tsx` → `app/recipes/[slug]/page.tsx`

**Smart Lookup**:
```typescript
// Try slug first
let recipe = await getRecipeBySlug(params.slug)

// Fallback to ID for backwards compatibility
if (!recipe && !isNaN(Number(params.slug))) {
  recipe = await getRecipeById(parseInt(params.slug))
}
```

### 5. Recipe Links

**RecipeCard Component**:
```typescript
const recipeUrl = recipe.slug
  ? `/recipes/${recipe.slug}`
  : `/recipes/${recipe.id}`
```

**Homepage**: Updated featured recipes to use slugs.

## 📋 Admin Panel Usage

### Creating a Recipe

1. Go to `/admin/recipes`
2. Click "+ Add Recipe"
3. Enter title: "Wild Mushroom Risotto"
4. Slug auto-fills: `wild-mushroom-risotto`
5. (Optional) Edit slug if desired
6. Save recipe

### Editing a Recipe

When editing:
- The slug is shown and can be modified
- Changing the title **does NOT** auto-update the slug (prevents breaking links)
- You can manually update the slug if needed

### Slug Field UI

```
┌─────────────────────────────────┐
│ URL Slug (SEO-friendly URL)     │
├─────────────────────────────────┤
│ wild-mushroom-risotto           │
├─────────────────────────────────┤
│ URL will be: /recipes/wild-mushroom-risotto
└─────────────────────────────────┘
```

## 🔄 Backwards Compatibility

Old URLs with numeric IDs still work:

```
/recipes/1               → ✅ Works (looks up by ID)
/recipes/dandelion-salad → ✅ Works (looks up by slug)
```

This ensures:
- Existing bookmarks work
- Old links in emails work
- Search engine indexed pages work

## 🧪 Testing

### Test URLs

After running the database schema:

```
# By Slug (SEO-friendly)
http://localhost:3001/recipes/dandelion-green-salad
http://localhost:3001/recipes/wild-berry-chocolate-bark
http://localhost:3001/recipes/roasted-vegetables-almond-crackers
http://localhost:3001/recipes/wild-mushroom-risotto

# By ID (backwards compatible)
http://localhost:3001/recipes/1
http://localhost:3001/recipes/2
http://localhost:3001/recipes/3
http://localhost:3001/recipes/4
```

### Test Cases

- ✅ Create recipe with auto-generated slug
- ✅ Create recipe with custom slug
- ✅ Edit recipe without changing slug
- ✅ Manually change slug
- ✅ Access recipe by slug URL
- ✅ Access recipe by old ID URL
- ✅ Slug appears in browser URL bar
- ✅ Unique constraint prevents duplicate slugs

## 📊 Database Migration

To add slugs to existing recipes:

```sql
-- Add slug column (already in schema)
ALTER TABLE recipes ADD COLUMN slug TEXT UNIQUE;

-- Auto-generate slugs for existing recipes
UPDATE recipes
SET slug = lower(
  regexp_replace(
    regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
```

## 🎨 SEO Benefits

### Google Search Results

**Before**:
```
Happy Foraging - Recipe
happyforaging.com/recipes/1
```

**After**:
```
Wild Berry Chocolate Bark - Happy Foraging
happyforaging.com/recipes/wild-berry-chocolate-bark
```

### Social Media Sharing

When sharing on Facebook/Twitter/LinkedIn:
- URL preview is more descriptive
- Users know what they're clicking
- Looks more professional

## 🔧 Customization

### Custom Slug Rules

Edit `lib/utils.ts` to customize slug generation:

```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Spaces to hyphens
    .replace(/[^\w\-]+/g, '') // Remove special chars
    .replace(/\-\-+/g, '-')   // Multiple hyphens to single
    .replace(/^-+/, '')       // Remove leading hyphens
    .replace(/-+$/, '')       // Remove trailing hyphens
}
```

### Slug Validation

Add validation in the admin form:

```typescript
const isValid = isValidSlug(formData.slug)
if (!isValid) {
  // Show error message
}
```

## 📈 Performance

### Database

- Indexed slug field → fast lookups
- Unique constraint → prevents duplicates
- Query plan uses index efficiently

### Caching

Next.js automatically caches recipe pages:
- Static generation for published recipes
- Fast subsequent loads
- CDN-friendly URLs

## 🚀 Future Enhancements

Possible improvements:

- [ ] Slug history/redirects (if slug changes)
- [ ] Slug suggestions based on keywords
- [ ] International character support (é, ñ, etc.)
- [ ] Automatic numbering for duplicate slugs
- [ ] Bulk slug regeneration tool
- [ ] SEO score based on slug quality

## 📚 Related Files

- `lib/utils.ts` - Slug generation utilities
- `lib/supabase.ts` - Database functions
- `app/recipes/[slug]/page.tsx` - Recipe detail page
- `app/admin/recipes/page.tsx` - Recipe admin form
- `components/RecipeCard.tsx` - Recipe card component
- `supabase-schema.sql` - Database schema

## 🎓 Best Practices

### Good Slugs
```
✅ wild-berry-chocolate-bark
✅ dandelion-green-salad
✅ roasted-vegetables
✅ mushroom-risotto
```

### Bad Slugs
```
❌ recipe1
❌ wild_berry_chocolate_bark (underscores)
❌ Wild-Berry-Chocolate-Bark (capitals)
❌ wild--berry--chocolate (double hyphens)
```

### Tips

1. **Keep it short**: 3-5 words ideal
2. **Use keywords**: Include main ingredient
3. **Be descriptive**: "chocolate-bark" not "bark"
4. **Avoid dates**: Don't use dates unless necessary
5. **Stay consistent**: Use same format for all recipes

## ✅ Summary

The slug feature is now complete and provides:
- ✨ SEO-friendly URLs
- 🚀 Auto-generation from titles
- ✏️ Manual override capability
- 🔄 Backwards compatibility
- 📊 Database indexing
- 🎯 Clean admin UI

Recipe URLs are now beautiful, shareable, and search-engine friendly!
