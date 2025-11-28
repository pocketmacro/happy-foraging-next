# Admin System Guide

Complete guide for the Happy Foraging admin system with authentication, recipe management, and ingredient database.

## Features

### 🔐 Authentication
- Secure login with Supabase Auth
- Protected admin routes with middleware
- Session management

### 🍽️ Recipe Management
- Create, edit, and delete recipes
- Rich recipe editor with all fields
- Ingredient management with searchable dropdown
- Auto-create ingredients if they don't exist
- Many-to-many relationship between recipes and ingredients
- Publish/draft status

### 📚 Guide Management
- Create, edit, and delete foraging guides
- Markdown content support
- Categories and tags
- Publish/draft status

### 🥬 Ingredient Database
- Centralized ingredient storage
- Searchable dropdown with auto-complete
- Automatic ingredient creation
- Categorized ingredients
- Reusable across recipes

### 🔍 Public Recipe Search
- Filter recipes by category
- Search by title or description
- **Filter by ingredients you have**
- Checkbox-based ingredient selector
- Shows recipes you can make with available ingredients

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Navigate to your Supabase project dashboard
# Go to SQL Editor
# Copy and paste the contents of supabase-schema.sql
# Click "Run"
```

This creates:
- `ingredients` table
- `recipes` table (updated with new fields)
- `recipe_ingredients` junction table
- `guides` table
- Row Level Security policies
- Sample data

### 2. Create Admin User

In your Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Click **Create User**

Example credentials:
- Email: `admin@happyforaging.com`
- Password: `your-secure-password`

### 3. Environment Variables

Make sure your `.env.local` has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Important**: Use the `anon/public` key, NOT the `service_role` key!

### 4. Test the Admin System

1. Start the development server:
```bash
npm run dev
```

2. Visit http://localhost:3001/login

3. Login with your admin credentials

4. You should be redirected to `/admin`

## Admin Panel Usage

### Dashboard (`/admin`)

The dashboard shows:
- Quick stats (recipes, guides, ingredients count)
- Quick action buttons
- Getting started guide

### Recipe Management (`/admin/recipes`)

#### Creating a Recipe

1. Click **+ Add Recipe**
2. Fill in recipe details:
   - **Title**: Recipe name
   - **Category**: Select from dropdown
   - **Description**: Brief summary
   - **Prep Time**: Minutes to prepare
   - **Cook Time**: Minutes to cook
   - **Servings**: Number of servings
   - **Difficulty**: easy/medium/hard
   - **Icon**: Emoji (e.g., 🥗)
   - **Image**: Path to image (e.g., `/images/recipes/salad.jpg`)

3. Add Ingredients:
   - Type in the **Search Ingredient** field
   - Select from existing ingredients OR
   - Click **+ Create "ingredient-name"** to add new
   - Enter **Quantity** (e.g., "2 cups", "1 tbsp")
   - Add **Notes** (e.g., "chopped", "diced")
   - Check **Optional** if ingredient is optional
   - Click **+ Add** to add to recipe

4. Write **Instructions** (each step on new line)

5. Check **Publish recipe** to make it public

6. Click **Create Recipe**

#### Editing a Recipe

1. Find the recipe in the list
2. Click **Edit**
3. Make your changes
4. Click **Update Recipe**

#### Deleting a Recipe

1. Find the recipe in the list
2. Click **Delete**
3. Confirm deletion

### Guide Management (`/admin/guides`)

#### Creating a Guide

1. Click **+ Add Guide**
2. Fill in guide details:
   - **Title**: Guide name
   - **Category**: beginner/safety/identification/seasonal/preservation/advanced
   - **Description**: Brief summary
   - **Icon**: Emoji (e.g., 🌿)
   - **Tags**: Comma-separated (e.g., "safety, mushrooms, beginner")
   - **Content**: Full guide content (Markdown supported)

3. Check **Publish guide** to make it public

4. Click **Create Guide**

#### Markdown Support

Guides support Markdown formatting:

```markdown
# Main Heading

## Sub Heading

**Bold text**
*Italic text*

- List item 1
- List item 2

1. Numbered item
2. Another item
```

## Ingredient System

### How It Works

1. **Centralized Database**: All ingredients are stored in one table
2. **Many-to-Many**: Recipes link to ingredients via `recipe_ingredients` table
3. **Auto-Creation**: If you type a new ingredient, it's automatically created
4. **Reusable**: Once created, ingredients can be used in any recipe

### Ingredient Data Structure

Each ingredient has:
- `id`: Unique identifier
- `name`: Ingredient name (unique)
- `category`: Optional category (herb, vegetable, fruit, mushroom, nut, grain)

Each recipe-ingredient relationship has:
- `ingredient_id`: Link to ingredient
- `recipe_id`: Link to recipe
- `quantity`: Amount needed (e.g., "2 cups")
- `optional`: Whether it's optional
- `notes`: Preparation notes (e.g., "finely chopped")

### Benefits

1. **Consistency**: Same ingredient name across all recipes
2. **Searchability**: Users can find recipes by ingredient
3. **Reusability**: Add ingredient once, use everywhere
4. **Flexibility**: Can add new ingredients on-the-fly

## Public Features

### Recipe Search by Ingredients

Users can now:

1. Go to `/recipes`
2. Click **Show Ingredients**
3. Select ingredients they have
4. See only recipes they can make!

This is perfect for:
- Using up ingredients before they spoil
- Finding recipes with foraged ingredients
- Planning meals based on available ingredients

### How the Filter Works

```typescript
// User selects: "Dandelion Greens", "Olive Oil", "Lemon Juice"
// System finds all recipes containing ANY of these ingredients
// Results: Dandelion Green Salad, etc.
```

## Database Schema

### Ingredients Table

```sql
CREATE TABLE ingredients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Recipes Table

```sql
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER DEFAULT 4,
    difficulty TEXT,
    icon TEXT,
    image TEXT,
    instructions TEXT NOT NULL,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Recipe Ingredients Table (Junction)

```sql
CREATE TABLE recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id BIGINT REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity TEXT,
    optional BOOLEAN DEFAULT false,
    notes TEXT,
    UNIQUE(recipe_id, ingredient_id)
);
```

### Guides Table

```sql
CREATE TABLE guides (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT,
    category TEXT,
    tags TEXT[],
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with these policies:

**Public Access**:
- Anyone can view published recipes
- Anyone can view published guides
- Anyone can view all ingredients

**Authenticated Access**:
- Only authenticated users can create/update/delete recipes
- Only authenticated users can create/update/delete guides
- Only authenticated users can create ingredients

### Middleware Protection

The `/admin` routes are protected by Next.js middleware:

```typescript
// middleware.ts
// Redirects to /login if not authenticated
```

## API Functions

### Recipe Functions

```typescript
// Get all recipes (or by category)
await getRecipes(category?)

// Get single recipe with ingredients
await getRecipeById(id)

// Search recipes by text
await searchRecipes(searchTerm)

// Find recipes by ingredient IDs
await getRecipesByIngredients([ingredientId1, ingredientId2])

// Create recipe (admin)
await createRecipe(recipeData)

// Update recipe (admin)
await updateRecipe(id, recipeData)

// Delete recipe (admin)
await deleteRecipe(id)
```

### Ingredient Functions

```typescript
// Get all ingredients
await getIngredients()

// Search ingredients
await searchIngredients(searchTerm)

// Create ingredient (admin)
await createIngredient(name, category?)

// Get or create ingredient (admin)
await getOrCreateIngredient(name, category?)

// Add ingredient to recipe (admin)
await addRecipeIngredient(recipeId, ingredientId, quantity, optional, notes)

// Remove ingredient from recipe (admin)
await removeRecipeIngredient(recipeId, ingredientId)
```

### Guide Functions

```typescript
// Get all guides (or by category)
await getGuides(category?)

// Get single guide
await getGuideById(id)

// Create guide (admin)
await createGuide(guideData)

// Update guide (admin)
await updateGuide(id, guideData)

// Delete guide (admin)
await deleteGuide(id)
```

## Troubleshooting

### Can't Login

1. Check Supabase credentials in `.env.local`
2. Verify user exists in Supabase Auth dashboard
3. Check browser console for errors
4. Ensure Supabase project is not paused

### Recipes Not Showing

1. Check if recipes are published (`published = true`)
2. Verify database connection
3. Check browser console for errors
4. Run SQL query in Supabase to verify data exists

### Ingredients Not Saving

1. Check if you're logged in
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Ensure unique constraint isn't violated (duplicate names)

### Images Not Loading

1. Verify images are in `public/images/` directory
2. Check image paths start with `/images/`
3. Verify image file names match exactly (case-sensitive)

## Best Practices

### Recipe Creation

1. **Use Descriptive Titles**: Clear and searchable
2. **Add Good Descriptions**: Help users find recipes
3. **Be Precise with Quantities**: "2 cups" not "some"
4. **Use Existing Ingredients**: Search before creating new
5. **Add Preparation Notes**: "finely chopped", "room temperature"
6. **Write Clear Instructions**: Step by step, numbered
7. **Use Quality Images**: Clear, well-lit photos

### Ingredient Management

1. **Consistent Naming**: "Wild Garlic" not "wild garlic" or "Wild-Garlic"
2. **Use Categories**: Helps with organization
3. **Search First**: Before creating, check if it exists
4. **Singular vs Plural**: Be consistent ("Mushroom" or "Mushrooms")

### Guide Writing

1. **Safety First**: Always include safety warnings
2. **Use Headings**: Structure with markdown headings
3. **Add Tags**: Makes guides searchable
4. **Include Images**: Visual aids help learning
5. **Cite Sources**: When appropriate
6. **Update Regularly**: Keep information current

## Future Enhancements

Potential features to add:

- [ ] Image upload directly in admin panel
- [ ] Bulk ingredient import from CSV
- [ ] Recipe versioning history
- [ ] User ratings and reviews
- [ ] Seasonal availability for ingredients
- [ ] Recipe collections/meal plans
- [ ] Nutritional information
- [ ] Print-friendly recipe view
- [ ] Recipe sharing on social media
- [ ] Email notifications for new content

## Support

For issues or questions:
- Check this guide first
- Review the database schema
- Check Supabase logs
- Check browser console for errors
- Review Next.js server logs

## License

All rights reserved - Happy Foraging
