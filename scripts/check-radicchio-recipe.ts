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
  console.log('🔍 Checking all recipes with "radicchio" and "endive" in title...\n')

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, published, featured')
    .or('title.ilike.%radicchio%,title.ilike.%endive%')

  if (error) {
    console.error('Error:', error)
    return
  }

  if (!recipes || recipes.length === 0) {
    console.log('✓ No radicchio/endive recipes found (confirmed deleted)')
    return
  }

  console.log(`Found ${recipes.length} recipe(s):\n`)
  recipes.forEach(recipe => {
    console.log(`- ${recipe.title}`)
    console.log(`  ID: ${recipe.id}, Published: ${recipe.published}, Featured: ${recipe.featured}\n`)
  })

  // Check current featured recipes
  console.log('📋 Current featured recipes in database:')
  const { data: featured } = await supabase
    .from('recipes')
    .select('id, title')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  featured?.forEach((recipe, idx) => {
    console.log(`  ${idx + 1}. ${recipe.title}`)
  })
}

main().catch(console.error)
