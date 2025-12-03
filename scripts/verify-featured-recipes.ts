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
  console.log('🔍 Checking all featured recipes in database...\n')

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, published, featured, created_at')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${recipes?.length || 0} featured recipes:\n`)
  recipes?.forEach((recipe, idx) => {
    console.log(`${idx + 1}. ${recipe.title}`)
    console.log(`   ID: ${recipe.id}, Featured: ${recipe.featured}, Published: ${recipe.published}`)
    console.log(`   Created: ${recipe.created_at}\n`)
  })
}

main().catch(console.error)
