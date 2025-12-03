import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🔍 Checking Cranberry Smoothie recipe...\n')

  // Check if recipe exists
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('id, title, published, featured')
    .ilike('title', '%cranberry%smoothie%')
    .single()

  if (error || !recipe) {
    console.log('✓ Cranberry Smoothie recipe not found in database (already deleted)')
    return
  }

  console.log(`Found recipe: ${recipe.title}`)
  console.log(`  Published: ${recipe.published}`)
  console.log(`  Featured: ${recipe.featured}`)

  // Delete the recipe
  console.log('\n🗑️  Deleting Cranberry Smoothie recipe...')

  const { error: deleteError } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipe.id)

  if (deleteError) {
    console.error('Error deleting recipe:', deleteError)
    return
  }

  console.log('✅ Successfully deleted Cranberry Smoothie recipe!')
}

main().catch(console.error)
