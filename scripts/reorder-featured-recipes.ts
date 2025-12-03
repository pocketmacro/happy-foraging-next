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
  console.log('📋 Checking current featured recipes order...\n')

  // Get current featured recipes
  const { data: featured, error } = await supabase
    .from('recipes')
    .select('id, title, created_at, featured')
    .eq('featured', true)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured recipes:', error)
    return
  }

  console.log('Current order:')
  featured?.forEach((recipe, idx) => {
    console.log(`  ${idx + 1}. ${recipe.title} (created: ${recipe.created_at})`)
  })

  // Update the mushroom taco recipe to have the most recent timestamp
  console.log('\n🔄 Setting mushroom taco recipe as first featured recipe...')

  const { error: updateError } = await supabase
    .from('recipes')
    .update({ created_at: new Date().toISOString() })
    .eq('slug', 'crispy-oyster-mushroom-tacos')

  if (updateError) {
    console.error('Error updating recipe:', updateError)
    return
  }

  console.log('✅ Successfully updated! Mushroom taco recipe will now show first.')

  // Show new order
  const { data: newFeatured } = await supabase
    .from('recipes')
    .select('id, title, created_at')
    .eq('featured', true)
    .eq('published', true)
    .order('created_at', { ascending: false })

  console.log('\nNew order:')
  newFeatured?.forEach((recipe, idx) => {
    console.log(`  ${idx + 1}. ${recipe.title}`)
  })
}

main().catch(console.error)
