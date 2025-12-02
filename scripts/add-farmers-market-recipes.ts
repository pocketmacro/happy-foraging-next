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

// New ingredients to add
const newIngredients = [
  { name: 'endive', category: 'vegetables' },
  { name: 'radicchio', category: 'vegetables' },
  { name: 'butternut squash', category: 'vegetables' },
  { name: 'oyster mushrooms', category: 'vegetables' },
  { name: 'bok choy', category: 'vegetables' },
  { name: 'napa cabbage', category: 'vegetables' },
  { name: 'purple majesty potatoes', category: 'vegetables' },
]

// Recipes featuring farmers market ingredients
const recipes = [
  {
    title: 'Roasted Butternut Squash with Sage',
    slug: 'roasted-butternut-squash-sage',
    description: 'A simple, delicious way to enjoy fresh butternut squash from the farmers market, roasted until caramelized and tossed with crispy sage.',
    category: ['sides', 'mains'],
    prep_time: 15,
    cook_time: 35,
    servings: 4,
    difficulty: 'easy',
    icon: '🎃',
    published: true,
    featured: true,
    instructions: `1. Preheat oven to 425°F and line a baking sheet with parchment paper.

2. Peel and cube the butternut squash into 1-inch pieces. Toss with olive oil, salt, and pepper.

3. Spread squash in a single layer on the baking sheet. Roast for 30-35 minutes, flipping halfway through, until golden and caramelized.

4. While squash roasts, heat 2 tablespoons butter in a small pan. Add sage leaves and cook until crispy, about 2 minutes.

5. Toss roasted squash with crispy sage and butter. Season to taste with salt, pepper, and a drizzle of maple syrup if desired.

6. Serve warm as a side dish or main course over grains.`,
    ingredients: [
      { name: 'butternut squash', quantity: '1 medium (about 2 lbs)', notes: 'peeled and cubed' },
      { name: 'olive oil', quantity: '3 tablespoons', notes: '' },
      { name: 'fresh sage', quantity: '10-12 leaves', notes: '' },
      { name: 'butter', quantity: '2 tablespoons', notes: '' },
      { name: 'salt', quantity: 'to taste', notes: '' },
      { name: 'black pepper', quantity: 'to taste', notes: '' },
      { name: 'maple syrup', quantity: '1-2 teaspoons', notes: '', optional: true },
    ]
  },
  {
    title: 'Grilled Radicchio and Endive Salad',
    slug: 'grilled-radicchio-endive-salad',
    description: 'This stunning salad showcases the beautiful bitter greens from your farmers market. Grilling brings out their sweet, complex flavors.',
    category: ['salads', 'sides'],
    prep_time: 10,
    cook_time: 8,
    servings: 4,
    difficulty: 'easy',
    icon: '🥬',
    published: true,
    featured: true,
    instructions: `1. Preheat grill or grill pan to medium-high heat.

2. Cut radicchio into quarters through the core, keeping leaves attached. Halve endives lengthwise.

3. Brush cut sides of radicchio and endive with olive oil and season with salt and pepper.

4. Grill cut-side down for 3-4 minutes until charred, then flip and grill another 3-4 minutes.

5. While grilling, whisk together balsamic vinegar, honey, Dijon mustard, and remaining olive oil for dressing.

6. Arrange grilled greens on a platter. Drizzle with dressing and top with shaved Parmesan, toasted walnuts, and fresh herbs.`,
    ingredients: [
      { name: 'radicchio', quantity: '1 head', notes: 'quartered' },
      { name: 'endive', quantity: '2 heads', notes: 'halved lengthwise' },
      { name: 'olive oil', quantity: '1/4 cup', notes: 'divided' },
      { name: 'balsamic vinegar', quantity: '2 tablespoons', notes: '' },
      { name: 'honey', quantity: '1 tablespoon', notes: '' },
      { name: 'Dijon mustard', quantity: '1 teaspoon', notes: '' },
      { name: 'Parmesan cheese', quantity: '1/4 cup', notes: 'shaved' },
      { name: 'walnuts', quantity: '1/3 cup', notes: 'toasted and chopped' },
      { name: 'fresh parsley', quantity: '2 tablespoons', notes: 'chopped', optional: true },
      { name: 'salt', quantity: 'to taste', notes: '' },
      { name: 'black pepper', quantity: 'to taste', notes: '' },
    ]
  },
  {
    title: 'Stir-Fried Bok Choy with Garlic',
    slug: 'stir-fried-bok-choy-garlic',
    description: 'Quick, vibrant, and packed with flavor! This simple stir-fry lets fresh bok choy from the farmers market shine.',
    category: ['sides'],
    prep_time: 10,
    cook_time: 5,
    servings: 4,
    difficulty: 'easy',
    icon: '🥬',
    published: true,
    featured: false,
    instructions: `1. Wash bok choy thoroughly and separate leaves. Cut into 2-inch pieces, keeping stems and leaves separate.

2. Heat sesame oil in a large wok or skillet over high heat until shimmering.

3. Add garlic and ginger, stir-fry for 30 seconds until fragrant.

4. Add bok choy stems first, stir-fry for 2 minutes until slightly softened.

5. Add leaves, soy sauce, and a splash of water or broth. Stir-fry for another 2 minutes until leaves are wilted but still bright green.

6. Season with salt and pepper to taste. Drizzle with additional sesame oil if desired. Serve immediately.`,
    ingredients: [
      { name: 'bok choy', quantity: '1.5 lbs', notes: 'about 4-5 heads, cut into 2-inch pieces' },
      { name: 'sesame oil', quantity: '2 tablespoons', notes: '' },
      { name: 'garlic', quantity: '4 cloves', notes: 'minced' },
      { name: 'fresh ginger', quantity: '1 tablespoon', notes: 'minced' },
      { name: 'soy sauce', quantity: '2 tablespoons', notes: '' },
      { name: 'vegetable broth', quantity: '2 tablespoons', notes: '', optional: true },
      { name: 'salt', quantity: 'to taste', notes: '' },
      { name: 'black pepper', quantity: 'to taste', notes: '' },
    ]
  },
  {
    title: 'Napa Cabbage Slaw with Sesame Dressing',
    slug: 'napa-cabbage-slaw-sesame',
    description: 'A crisp, refreshing slaw featuring tender napa cabbage from your local farmers market, tossed in a tangy sesame dressing.',
    category: ['salads', 'sides'],
    prep_time: 15,
    cook_time: 0,
    servings: 6,
    difficulty: 'easy',
    icon: '🥗',
    published: true,
    featured: false,
    instructions: `1. Thinly slice napa cabbage and place in a large bowl. Add shredded carrots and sliced green onions.

2. In a small bowl, whisk together rice vinegar, sesame oil, soy sauce, honey, and grated ginger until well combined.

3. Pour dressing over cabbage mixture and toss well to coat.

4. Let slaw sit for 10-15 minutes to allow flavors to meld.

5. Just before serving, add toasted sesame seeds, cilantro, and crushed peanuts or almonds. Toss again.

6. Serve chilled or at room temperature. This slaw gets better after sitting for a few hours!`,
    ingredients: [
      { name: 'napa cabbage', quantity: '1 medium head (about 2 lbs)', notes: 'thinly sliced' },
      { name: 'carrots', quantity: '2 medium', notes: 'shredded' },
      { name: 'green onions', quantity: '4', notes: 'thinly sliced' },
      { name: 'rice vinegar', quantity: '3 tablespoons', notes: '' },
      { name: 'sesame oil', quantity: '2 tablespoons', notes: '' },
      { name: 'soy sauce', quantity: '1 tablespoon', notes: '' },
      { name: 'honey', quantity: '1 tablespoon', notes: '' },
      { name: 'fresh ginger', quantity: '1 teaspoon', notes: 'grated' },
      { name: 'sesame seeds', quantity: '2 tablespoons', notes: 'toasted' },
      { name: 'fresh cilantro', quantity: '1/4 cup', notes: 'chopped', optional: true },
      { name: 'peanuts', quantity: '1/4 cup', notes: 'crushed', optional: true },
    ]
  },
  {
    title: 'Crispy Oyster Mushroom Tacos',
    slug: 'crispy-oyster-mushroom-tacos',
    description: 'These show-stopping tacos feature fresh oyster mushrooms from the farmers market, pan-fried until golden and crispy!',
    category: ['mains'],
    prep_time: 15,
    cook_time: 15,
    servings: 4,
    difficulty: 'easy',
    icon: '🌮',
    published: true,
    featured: true,
    instructions: `1. Tear oyster mushrooms into strips along the natural grain. Toss with olive oil, chili powder, cumin, garlic powder, salt, and pepper.

2. Heat a large skillet over medium-high heat. Add mushrooms in a single layer (work in batches if needed).

3. Cook without stirring for 3-4 minutes until golden and crispy on the bottom. Flip and cook another 3-4 minutes.

4. While mushrooms cook, prepare your toppings: shred cabbage, dice avocado, chop cilantro, and make a quick crema by mixing sour cream with lime juice.

5. Warm tortillas in a dry skillet or directly over a gas flame.

6. Assemble tacos with crispy mushrooms, cabbage, avocado, cilantro, and lime crema. Serve with lime wedges!`,
    ingredients: [
      { name: 'oyster mushrooms', quantity: '1 lb', notes: 'torn into strips' },
      { name: 'olive oil', quantity: '3 tablespoons', notes: '' },
      { name: 'chili powder', quantity: '1 teaspoon', notes: '' },
      { name: 'ground cumin', quantity: '1 teaspoon', notes: '' },
      { name: 'garlic powder', quantity: '1/2 teaspoon', notes: '' },
      { name: 'corn tortillas', quantity: '8-10', notes: '' },
      { name: 'cabbage', quantity: '2 cups', notes: 'shredded' },
      { name: 'avocado', quantity: '1 large', notes: 'diced' },
      { name: 'fresh cilantro', quantity: '1/2 cup', notes: 'chopped' },
      { name: 'sour cream', quantity: '1/2 cup', notes: '' },
      { name: 'lime', quantity: '2', notes: '1 juiced, 1 cut into wedges' },
      { name: 'salt', quantity: 'to taste', notes: '' },
      { name: 'black pepper', quantity: 'to taste', notes: '' },
    ]
  },
  {
    title: 'Purple Majesty Potato Salad',
    slug: 'purple-majesty-potato-salad',
    description: 'This stunning potato salad showcases beautiful purple potatoes from your farmers market. The vibrant color and creamy texture make it a real showstopper!',
    category: ['salads', 'sides'],
    prep_time: 15,
    cook_time: 20,
    servings: 6,
    difficulty: 'easy',
    icon: '🥔',
    published: true,
    featured: false,
    instructions: `1. Cut purple potatoes into bite-sized pieces. Place in a large pot and cover with cold salted water.

2. Bring to a boil, then reduce heat and simmer for 15-20 minutes until fork-tender but not falling apart.

3. Drain potatoes and let cool slightly while you prepare the dressing.

4. In a large bowl, whisk together mayonnaise, Dijon mustard, apple cider vinegar, honey, salt, and pepper.

5. Add warm potatoes to the dressing and gently toss to coat. The warm potatoes will absorb the dressing beautifully!

6. Fold in diced celery, red onion, and fresh dill. Let salad cool to room temperature or refrigerate for at least 1 hour before serving.

7. Garnish with extra dill and a sprinkle of paprika before serving.`,
    ingredients: [
      { name: 'purple majesty potatoes', quantity: '2 lbs', notes: 'cut into 1-inch pieces' },
      { name: 'mayonnaise', quantity: '3/4 cup', notes: '' },
      { name: 'Dijon mustard', quantity: '2 tablespoons', notes: '' },
      { name: 'apple cider vinegar', quantity: '2 tablespoons', notes: '' },
      { name: 'honey', quantity: '1 teaspoon', notes: '' },
      { name: 'celery', quantity: '2 stalks', notes: 'finely diced' },
      { name: 'red onion', quantity: '1/4 cup', notes: 'finely diced' },
      { name: 'fresh dill', quantity: '1/4 cup', notes: 'chopped' },
      { name: 'salt', quantity: 'to taste', notes: '' },
      { name: 'black pepper', quantity: 'to taste', notes: '' },
      { name: 'paprika', quantity: 'for garnish', notes: '', optional: true },
    ]
  },
]

async function getOrCreateIngredient(name: string, category: string) {
  // Check if ingredient exists
  const { data: existing } = await supabase
    .from('ingredients')
    .select('*')
    .ilike('name', name)
    .single()

  if (existing) {
    console.log(`  ✓ Ingredient "${name}" already exists`)
    return existing
  }

  // Create new ingredient
  const { data, error } = await supabase
    .from('ingredients')
    .insert({ name, category })
    .select()
    .single()

  if (error) {
    console.error(`  ✗ Error creating ingredient "${name}":`, error)
    return null
  }

  console.log(`  + Created new ingredient: "${name}"`)
  return data
}

async function addRecipe(recipeData: any) {
  const { ingredients: recipeIngredients, ...recipeFields } = recipeData

  // Check if recipe already exists
  const { data: existing } = await supabase
    .from('recipes')
    .select('id')
    .eq('slug', recipeFields.slug)
    .single()

  if (existing) {
    console.log(`  ⚠ Recipe "${recipeFields.title}" already exists, skipping...`)
    return
  }

  // Create recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert(recipeFields)
    .select()
    .single()

  if (recipeError) {
    console.error(`  ✗ Error creating recipe "${recipeFields.title}":`, recipeError)
    return
  }

  console.log(`  + Created recipe: "${recipeFields.title}"`)

  // Add ingredients
  for (let i = 0; i < recipeIngredients.length; i++) {
    const ing = recipeIngredients[i]
    const ingredient = await getOrCreateIngredient(ing.name, 'vegetables')

    if (ingredient) {
      const { error: linkError } = await supabase
        .from('recipe_ingredients')
        .insert({
          recipe_id: recipe.id,
          ingredient_id: ingredient.id,
          quantity: ing.quantity,
          optional: ing.optional || false,
          notes: ing.notes || null,
          display_order: i
        })

      if (linkError) {
        console.error(`    ✗ Error adding ingredient "${ing.name}" to recipe:`, linkError)
      }
    }
  }
}

async function main() {
  console.log('🌱 Starting farmers market recipes seed...\n')

  console.log('📦 Adding ingredients...')
  for (const ing of newIngredients) {
    await getOrCreateIngredient(ing.name, ing.category)
  }

  console.log('\n🍳 Adding recipes...')
  for (const recipe of recipes) {
    await addRecipe(recipe)
  }

  console.log('\n✅ Seed completed successfully!')
}

main().catch(console.error)
