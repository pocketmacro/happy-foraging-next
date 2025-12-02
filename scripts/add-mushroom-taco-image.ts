import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('📸 Adding mushroom taco image...\n')

  // Find the mushroom taco recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('id')
    .eq('slug', 'crispy-oyster-mushroom-tacos')
    .single()

  if (recipeError || !recipe) {
    console.error('❌ Could not find Crispy Oyster Mushroom Tacos recipe')
    return
  }

  console.log(`✓ Found recipe (ID: ${recipe.id})`)

  // Check if image already exists for this recipe
  const { data: existingImages } = await supabase
    .from('recipe_images')
    .select('*')
    .eq('recipe_id', recipe.id)
    .eq('public_url', 'https://jfybqfqxethprtvnkuvj.supabase.co/storage/v1/object/public/recipe-images/recipes/content/MushroomTacos.jpg')

  if (existingImages && existingImages.length > 0) {
    console.log('⚠ Image already exists for this recipe')
    return
  }

  // Add the image
  const { data: image, error: imageError } = await supabase
    .from('recipe_images')
    .insert({
      recipe_id: recipe.id,
      storage_path: 'recipes/content/MushroomTacos.jpg',
      public_url: 'https://jfybqfqxethprtvnkuvj.supabase.co/storage/v1/object/public/recipe-images/recipes/content/MushroomTacos.jpg',
      is_primary: true,
      display_order: 0,
      alt_text: 'Crispy Oyster Mushroom Tacos'
    })
    .select()
    .single()

  if (imageError) {
    console.error('❌ Error adding image:', imageError)
    return
  }

  console.log('✅ Successfully added mushroom taco image as primary image!')
}

main().catch(console.error)
