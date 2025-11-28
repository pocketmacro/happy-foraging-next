import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Basic client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client creator for client-side auth
export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// =====================================================
// TYPES
// =====================================================

export type Ingredient = {
  id: number
  name: string
  category: string | null
  url: string | null
  created_at: string
  updated_at: string
}

export type RecipeIngredient = {
  id: number
  recipe_id: number
  ingredient_id: number
  quantity: string | null
  optional: boolean
  notes: string | null
  ingredient?: Ingredient
}

export type RecipeImage = {
  id: number
  recipe_id: number
  storage_path: string
  public_url: string
  is_primary: boolean
  display_order: number
  alt_text: string | null
  created_at: string
}

export type Recipe = {
  id: number
  title: string
  slug: string | null
  description: string
  category: string[]
  prep_time: number | null
  cook_time: number | null
  servings: number
  difficulty: string | null
  icon: string | null
  image: string | null
  instructions: string
  published: boolean
  featured: boolean
  created_at: string
  updated_at: string
  recipe_ingredients?: RecipeIngredient[]
  recipe_images?: RecipeImage[]
}

export type Guide = {
  id: number
  title: string
  description: string
  content: string
  icon: string | null
  category: string | null
  tags: string[] | null
  published: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// RECIPE FUNCTIONS
// =====================================================

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          id,
          quantity,
          optional,
          notes,
          ingredient:ingredients (
            id,
            name,
            category
          )
        ),
        recipe_images (
          id,
          storage_path,
          public_url,
          is_primary,
          display_order,
          alt_text,
          created_at
        )
      `)
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching featured recipes:', error)
    return []
  }
}

export async function getRecipes(category?: string, includeUnpublished: boolean = false): Promise<Recipe[]> {
  try {
    let query = supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          id,
          quantity,
          optional,
          notes,
          ingredient:ingredients (
            id,
            name,
            category
          )
        ),
        recipe_images (
          id,
          storage_path,
          public_url,
          is_primary,
          display_order,
          alt_text,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    // Only filter by published status if not including unpublished
    if (!includeUnpublished) {
      query = query.eq('published', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          id,
          quantity,
          optional,
          notes,
          ingredient:ingredients (
            id,
            name,
            category
          )
        ),
        recipe_images (
          id,
          storage_path,
          public_url,
          is_primary,
          display_order,
          alt_text,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          id,
          quantity,
          optional,
          notes,
          ingredient:ingredients (
            id,
            name,
            category
          )
        ),
        recipe_images (
          id,
          storage_path,
          public_url,
          is_primary,
          display_order,
          alt_text,
          created_at
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching recipe by slug:', error)
    return null
  }
}

export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          id,
          quantity,
          optional,
          notes,
          ingredient:ingredients (
            id,
            name,
            category
          )
        )
      `)
      .eq('published', true)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching recipes:', error)
    return []
  }
}

export async function getRecipesByIngredients(ingredientIds: number[]): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients!inner (
          id,
          quantity,
          optional,
          notes,
          ingredient:ingredients (
            id,
            name,
            category
          )
        )
      `)
      .eq('published', true)
      .in('recipe_ingredients.ingredient_id', ingredientIds)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error)
    return []
  }
}

// =====================================================
// INGREDIENT FUNCTIONS
// =====================================================

export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return []
  }
}

export async function searchIngredients(searchTerm: string): Promise<Ingredient[]> {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name', { ascending: true })
      .limit(20)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching ingredients:', error)
    return []
  }
}

export async function createIngredient(name: string, category?: string, url?: string): Promise<Ingredient | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('ingredients')
      .insert({ name, category, url })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating ingredient:', error)
    return null
  }
}

export async function updateIngredient(id: number, updates: Partial<Ingredient>): Promise<Ingredient | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('ingredients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating ingredient:', error)
    return null
  }
}

export async function deleteIngredient(id: number): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient
      .from('ingredients')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    return false
  }
}

export async function getOrCreateIngredient(name: string, category?: string): Promise<Ingredient | null> {
  try {
    const browserClient = createClientComponentClient()
    // Try to find existing ingredient
    const { data: existing } = await browserClient
      .from('ingredients')
      .select('*')
      .ilike('name', name)
      .single()

    if (existing) return existing

    // Create new ingredient if not found
    return await createIngredient(name, category)
  } catch (error) {
    console.error('Error getting or creating ingredient:', error)
    return null
  }
}

// =====================================================
// GUIDE FUNCTIONS
// =====================================================

export async function getGuides(category?: string): Promise<Guide[]> {
  try {
    let query = supabase
      .from('guides')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching guides:', error)
    return []
  }
}

export async function getGuideById(id: number): Promise<Guide | null> {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching guide:', error)
    return null
  }
}

// =====================================================
// ADMIN FUNCTIONS (Require Authentication)
// =====================================================

export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('recipes')
      .insert(recipe)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating recipe:', error)
    return null
  }
}

export async function updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('recipes')
      .update(recipe)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating recipe:', error)
    return null
  }
}

export async function deleteRecipe(id: number): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return false
  }
}

export async function addRecipeIngredient(
  recipeId: number,
  ingredientId: number,
  quantity: string,
  optional: boolean = false,
  notes?: string
): Promise<RecipeIngredient | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('recipe_ingredients')
      .insert({
        recipe_id: recipeId,
        ingredient_id: ingredientId,
        quantity,
        optional,
        notes
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding recipe ingredient:', error)
    return null
  }
}

export async function removeRecipeIngredient(recipeId: number, ingredientId: number): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('ingredient_id', ingredientId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing recipe ingredient:', error)
    return false
  }
}

export async function createGuide(guide: Partial<Guide>): Promise<Guide | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('guides')
      .insert(guide)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating guide:', error)
    return null
  }
}

export async function updateGuide(id: number, guide: Partial<Guide>): Promise<Guide | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('guides')
      .update(guide)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating guide:', error)
    return null
  }
}

export async function deleteGuide(id: number): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient
      .from('guides')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting guide:', error)
    return false
  }
}

// =====================================================
// CONTENT IMAGE UPLOAD FUNCTIONS (for markdown content)
// =====================================================

export type StorageFile = {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    size: number
    mimetype: string
  }
}

/**
 * Upload an image for use in markdown content (recipes, guides, etc.)
 */
export async function uploadContentImage(
  file: File,
  folder: 'recipes' | 'guides' = 'recipes'
): Promise<{ url: string; path: string } | null> {
  try {
    const browserClient = createClientComponentClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/content/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    console.log('Uploading content image:', fileName, 'Size:', file.size, 'Type:', file.type)

    // Upload to storage in content-images bucket
    const { data: uploadData, error: uploadError } = await browserClient.storage
      .from('recipe-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error details:', uploadError)
      throw uploadError
    }

    console.log('Content image upload successful:', uploadData)

    // Get public URL
    const { data: { publicUrl } } = browserClient.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    console.log('Content image public URL:', publicUrl)

    return { url: publicUrl, path: fileName }
  } catch (error) {
    console.error('Error uploading content image:', error)
    return null
  }
}

/**
 * List all uploaded content images
 */
export async function listContentImages(
  folder: 'recipes' | 'guides' = 'recipes'
): Promise<Array<{ url: string; name: string; path: string; size: number; created_at: string }>> {
  try {
    const browserClient = createClientComponentClient()

    const { data, error } = await browserClient.storage
      .from('recipe-images')
      .list(`${folder}/content`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    // Map files to include public URLs
    const filesWithUrls = (data || []).map(file => {
      const path = `${folder}/content/${file.name}`
      const { data: { publicUrl } } = browserClient.storage
        .from('recipe-images')
        .getPublicUrl(path)

      return {
        url: publicUrl,
        name: file.name,
        path: path,
        size: file.metadata?.size || 0,
        created_at: file.created_at
      }
    })

    return filesWithUrls
  } catch (error) {
    console.error('Error listing content images:', error)
    return []
  }
}

/**
 * Delete a content image from storage
 */
export async function deleteContentImage(path: string): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient.storage
      .from('recipe-images')
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting content image:', error)
    return false
  }
}

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// =====================================================
// IMAGE UPLOAD FUNCTIONS
// =====================================================

/**
 * Upload a recipe image to Supabase Storage
 */
export async function uploadRecipeImage(
  file: File,
  recipeId: number
): Promise<{ path: string; url: string } | null> {
  try {
    // Use browser client for authenticated uploads
    const browserClient = createClientComponentClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${recipeId}/${Date.now()}.${fileExt}`

    console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type)

    // Upload to storage
    const { data: uploadData, error: uploadError } = await browserClient.storage
      .from('recipe-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error details:', uploadError)
      throw uploadError
    }

    console.log('Upload successful:', uploadData)

    // Get public URL
    const { data: { publicUrl } } = browserClient.storage
      .from('recipe-images')
      .getPublicUrl(fileName)

    console.log('Public URL:', publicUrl)

    return {
      path: fileName,
      url: publicUrl
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

/**
 * Delete a recipe image from Supabase Storage
 */
export async function deleteRecipeImage(path: string): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient.storage
      .from('recipe-images')
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

/**
 * Add image record to recipe_images table
 */
export async function addRecipeImageRecord(
  recipeId: number,
  storagePath: string,
  publicUrl: string,
  isPrimary: boolean = false,
  displayOrder: number = 0,
  altText: string = ''
): Promise<RecipeImage | null> {
  try {
    const browserClient = createClientComponentClient()
    const { data, error } = await browserClient
      .from('recipe_images')
      .insert({
        recipe_id: recipeId,
        storage_path: storagePath,
        public_url: publicUrl,
        is_primary: isPrimary,
        display_order: displayOrder,
        alt_text: altText
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding image record:', error)
    return null
  }
}

/**
 * Get all images for a recipe
 */
export async function getRecipeImages(recipeId: number): Promise<RecipeImage[]> {
  try {
    const { data, error } = await supabase
      .from('recipe_images')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recipe images:', error)
    return []
  }
}

/**
 * Get primary image for a recipe
 */
export async function getPrimaryRecipeImage(recipeId: number): Promise<RecipeImage | null> {
  try {
    const { data, error } = await supabase
      .from('recipe_images')
      .select('*')
      .eq('recipe_id', recipeId)
      .eq('is_primary', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching primary image:', error)
    return null
  }
}

/**
 * Set an image as primary (unsets others)
 */
export async function setPrimaryImage(imageId: number): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient
      .from('recipe_images')
      .update({ is_primary: true })
      .eq('id', imageId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error setting primary image:', error)
    return false
  }
}

/**
 * Delete an image record and its file
 */
export async function deleteRecipeImageRecord(imageId: number): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    // Get the image record first to get storage path
    const { data: image, error: fetchError } = await browserClient
      .from('recipe_images')
      .select('storage_path')
      .eq('id', imageId)
      .single()

    if (fetchError) throw fetchError

    // Delete from storage
    await deleteRecipeImage(image.storage_path)

    // Delete record from database
    const { error: deleteError } = await browserClient
      .from('recipe_images')
      .delete()
      .eq('id', imageId)

    if (deleteError) throw deleteError
    return true
  } catch (error) {
    console.error('Error deleting image record:', error)
    return false
  }
}

/**
 * Update image display order
 */
export async function updateImageOrder(
  imageId: number,
  displayOrder: number
): Promise<boolean> {
  try {
    const browserClient = createClientComponentClient()
    const { error } = await browserClient
      .from('recipe_images')
      .update({ display_order: displayOrder })
      .eq('id', imageId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating image order:', error)
    return false
  }
}
