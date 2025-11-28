# Recipe Image Upload Feature

Complete guide to uploading and managing recipe images with Supabase Storage.

## ✨ Features

- 📸 **Multiple Images** - Upload multiple images per recipe
- 🌟 **Primary Image** - Flag one image as primary for cards and featured sections
- 🖼️ **Image Gallery** - Display all images in a beautiful gallery on recipe pages
- 🗂️ **Organized Storage** - Images stored in Supabase Storage by recipe ID
- 🎨 **Easy Management** - Upload, set primary, and delete from admin panel
- ♻️ **Automatic Cleanup** - Deleting an image removes it from storage

## 🗄️ Database Structure

### recipe_images Table

```sql
CREATE TABLE recipe_images (
  id BIGSERIAL PRIMARY KEY,
  recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Name**: `recipe-images`
- **Public**: Yes (images are publicly accessible)
- **Organization**: Images stored as `{recipe_id}/{timestamp}.{ext}`

## 📸 How to Upload Images

### From the Admin Panel

1. **Navigate to Admin > Recipes**

2. **Edit an Existing Recipe**
   - Click "Edit" on any recipe
   - Scroll to the "Recipe Images" section
   - You cannot upload images when creating a new recipe (must save first)

3. **Upload Images**
   - Click "+ Add Images" button
   - Select one or multiple image files
   - Supported formats: JPG, PNG, GIF, WEBP
   - Images upload automatically

4. **Manage Images**
   - **Set as Primary**: Hover over any image and click "Set as Primary"
   - **Delete**: Hover over any image and click "Delete"
   - Primary image has a green border and "Primary" badge

### For New Recipes

When creating a new recipe:
1. Fill in recipe details and click "Create Recipe"
2. The recipe will be saved
3. Click "Edit" on the recipe you just created
4. Now you can upload images

## 🎯 How Images Are Used

### Recipe Cards

- Shows the **primary image** if available
- Falls back to the old `recipe.image` field if no uploaded images
- Used on:
  - `/recipes` page (recipe list)
  - Homepage featured recipes
  - Search results

### Recipe Detail Pages

- **Header**: Shows the primary image
- **Gallery**: Shows all other images in a grid below the instructions
- Gallery only appears if there are 2+ images

### Example

```
Recipe: "Wild Berry Chocolate Bark"
Images:
  1. chocolate-bark-1.jpg (PRIMARY) ← Used in cards and header
  2. chocolate-bark-close-up.jpg   ← Gallery
  3. chocolate-bark-plated.jpg     ← Gallery
```

## 🔧 Technical Implementation

### Upload Process

1. **File Selection**: User selects image(s) from file picker
2. **Storage Upload**: Each file uploaded to Supabase Storage at `recipe-images/{recipeId}/{timestamp}.{ext}`
3. **Get Public URL**: Supabase returns the public URL
4. **Database Record**: Create entry in `recipe_images` table with storage path and URL
5. **Auto-Primary**: If it's the first image for this recipe, automatically mark as primary

### Primary Image Logic

- **Database Trigger**: Ensures only ONE primary image per recipe
- When setting an image as primary, automatically unsets all other images for that recipe
- Handled by PostgreSQL trigger function `ensure_single_primary_image()`

### Image Deletion

1. Fetch the image record from database (to get storage path)
2. Delete the file from Supabase Storage
3. Delete the database record
4. If the primary image is deleted, you'll need to set a new primary

## 📋 Admin Interface Components

### ImageUpload Component

Location: `components/admin/ImageUpload.tsx`

**Features**:
- Multiple file upload
- Grid display of uploaded images
- Primary image indicator
- Hover controls for Set Primary / Delete
- Upload progress feedback
- Automatic refresh after changes

**Props**:
```typescript
interface ImageUploadProps {
  recipeId: number              // The recipe to upload for
  images: RecipeImage[]         // Current images
  onImagesChange: () => void    // Callback to refresh images
}
```

### Integration in Admin Form

Location: `app/admin/recipes/page.tsx`

- Only shown when editing an existing recipe
- Hidden for new recipes (with helpful tip message)
- Automatically loads images when editing
- Refreshes after upload/delete

## 🔌 API Functions

All functions available in `lib/supabase.ts`:

### Upload Functions

```typescript
// Upload a file to storage
uploadRecipeImage(file: File, recipeId: number)
  → Promise<{ path: string; url: string } | null>

// Add database record for uploaded image
addRecipeImageRecord(
  recipeId: number,
  storagePath: string,
  publicUrl: string,
  isPrimary: boolean = false,
  displayOrder: number = 0,
  altText: string = ''
) → Promise<RecipeImage | null>
```

### Query Functions

```typescript
// Get all images for a recipe (ordered by display_order)
getRecipeImages(recipeId: number)
  → Promise<RecipeImage[]>

// Get just the primary image
getPrimaryRecipeImage(recipeId: number)
  → Promise<RecipeImage | null>
```

### Management Functions

```typescript
// Set an image as primary (unsets others)
setPrimaryImage(imageId: number)
  → Promise<boolean>

// Delete image from storage AND database
deleteRecipeImageRecord(imageId: number)
  → Promise<boolean>

// Update display order
updateImageOrder(imageId: number, displayOrder: number)
  → Promise<boolean>
```

## 🎨 Frontend Components

### RecipeCard

- Automatically uses primary image if available
- Falls back to `recipe.image` field
- No changes needed when using the component

```typescript
// Automatic primary image detection
const primaryImage = recipe.recipe_images?.find(img => img.is_primary)
const imageUrl = primaryImage?.public_url || recipe.image
```

### Recipe Detail Page

- Header shows primary image
- Gallery section shows all non-primary images
- Gallery auto-hides if only one image exists

## 🔒 Security & Permissions

### Row Level Security

**Public Access**:
- Anyone can view images (read-only)

**Authenticated Users**:
- Can upload images
- Can update image metadata
- Can delete images
- Can set primary image

### Storage Policies

- **Public Read**: Anyone can view images in the bucket
- **Authenticated Write**: Only logged-in users can upload/delete

## 📊 Database Migration

The migration file: `supabase/migrations/20251128175837_add_recipe_images.sql`

Includes:
- Table creation
- Indexes for performance
- Row Level Security policies
- Storage bucket setup
- Primary image trigger function

### To Apply Migration

```bash
npm run db:push
```

## 🎯 Best Practices

### Image Sizes

- **Recommended**: 1200x800px or larger
- **Aspect Ratio**: 3:2 or 4:3 works best
- **Format**: JPG for photos, PNG for graphics
- **File Size**: Keep under 2MB for fast loading

### Alt Text

- Automatically uses filename (without extension)
- You can update it in the database if needed
- Used for accessibility and SEO

### Primary Image

- Choose your best, most appealing photo
- This appears in recipe cards and search results
- Make it representative of the dish

### Gallery Images

- Show different angles or steps
- Include close-ups of interesting details
- Show the finished dish in different contexts

## 🐛 Troubleshooting

### Images Not Uploading

**Check**:
1. File format supported (JPG, PNG, GIF, WEBP)
2. File size not too large (< 10MB)
3. You're editing an existing recipe (not creating new)
4. Internet connection is stable

**Console Errors**:
- Check browser console (F12) for detailed errors
- Common: CORS issues, authentication problems

### Images Not Showing

**Check**:
1. Image uploaded successfully (check Storage in Supabase dashboard)
2. Public URL is correct in database
3. RLS policies allow public read access
4. Browser cache (try hard refresh: Ctrl+Shift+R)

### Primary Image Not Working

**Check**:
1. Only one image should be marked as primary
2. Run this query to verify:
   ```sql
   SELECT id, recipe_id, is_primary
   FROM recipe_images
   WHERE recipe_id = YOUR_RECIPE_ID;
   ```
3. Trigger function is working correctly

### Storage Quota

Supabase free tier includes 1GB storage:
- Monitor usage in Supabase dashboard
- Delete unused images
- Optimize image sizes before upload

## 📁 File Structure

```
happy-foraging-next/
├── components/
│   └── admin/
│       └── ImageUpload.tsx           # Upload component
├── lib/
│   └── supabase.ts                   # Image functions
├── app/
│   ├── admin/
│   │   └── recipes/
│   │       └── page.tsx              # Includes ImageUpload
│   ├── recipes/
│   │   └── [slug]/
│   │       └── page.tsx              # Shows gallery
│   └── components/
│       └── RecipeCard.tsx            # Uses primary image
└── supabase/
    └── migrations/
        └── 20251128175837_add_recipe_images.sql
```

## 🚀 Future Enhancements

Possible improvements:

- [ ] Drag-and-drop image upload
- [ ] Image cropping/editing before upload
- [ ] Drag to reorder gallery images
- [ ] Bulk image upload
- [ ] Image compression on upload
- [ ] Lightbox/modal for full-size viewing
- [ ] Caption editing for each image
- [ ] Image analytics (views, clicks)

## 💡 Tips

1. **Always set a primary image** - Recipe cards look better with one
2. **Upload multiple angles** - Helps users see what to expect
3. **Use good lighting** - Clear, well-lit photos work best
4. **Show the process** - Include step-by-step photos if helpful
5. **Delete unused images** - Keep storage clean and organized

---

**Need help?** Check the troubleshooting section above or review the database schema in the migration file.
