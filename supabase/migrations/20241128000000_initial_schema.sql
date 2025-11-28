-- =====================================================
-- NOTE: Supabase manages JWT secrets automatically
-- You don't need to set app.jwt_secret manually
-- =====================================================
-- INGREDIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ingredients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT, -- e.g., 'herb', 'vegetable', 'fruit', 'mushroom', 'nut', 'grain'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GUIDES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS guides (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT,
    category TEXT, -- e.g., 'safety', 'identification', 'seasonal', 'preservation'
    tags TEXT[], -- Array of tags for searching
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RECIPES TABLE (Updated)
-- =====================================================
CREATE TABLE IF NOT EXISTS recipes (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE, -- URL-friendly version of title for SEO
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'salads', 'soups', 'mains', 'sides', 'desserts', 'preserves'
    prep_time INTEGER, -- in minutes
    cook_time INTEGER, -- in minutes
    servings INTEGER DEFAULT 4,
    difficulty TEXT, -- 'easy', 'medium', 'hard'
    icon TEXT,
    image TEXT,
    instructions TEXT NOT NULL,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RECIPE_INGREDIENTS (Many-to-Many Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id BIGINT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity TEXT, -- e.g., '2 cups', '1 tbsp', '4 large'
    optional BOOLEAN DEFAULT false,
    notes TEXT, -- e.g., 'finely chopped', 'room temperature'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, ingredient_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_published ON recipes(published);
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(published);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON recipes;
CREATE POLICY "Public recipes are viewable by everyone"
    ON recipes FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Public guides are viewable by everyone" ON guides;
CREATE POLICY "Public guides are viewable by everyone"
    ON guides FOR SELECT
    USING (published = true);

DROP POLICY IF EXISTS "Ingredients are viewable by everyone" ON ingredients;
CREATE POLICY "Ingredients are viewable by everyone"
    ON ingredients FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Recipe ingredients are viewable by everyone" ON recipe_ingredients;
CREATE POLICY "Recipe ingredients are viewable by everyone"
    ON recipe_ingredients FOR SELECT
    USING (true);

-- Authenticated users can manage all content
DROP POLICY IF EXISTS "Authenticated users can insert recipes" ON recipes;
CREATE POLICY "Authenticated users can insert recipes"
    ON recipes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update recipes" ON recipes;
CREATE POLICY "Authenticated users can update recipes"
    ON recipes FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete recipes" ON recipes;
CREATE POLICY "Authenticated users can delete recipes"
    ON recipes FOR DELETE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert guides" ON guides;
CREATE POLICY "Authenticated users can insert guides"
    ON guides FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update guides" ON guides;
CREATE POLICY "Authenticated users can update guides"
    ON guides FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete guides" ON guides;
CREATE POLICY "Authenticated users can delete guides"
    ON guides FOR DELETE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert ingredients" ON ingredients;
CREATE POLICY "Authenticated users can insert ingredients"
    ON ingredients FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update ingredients" ON ingredients;
CREATE POLICY "Authenticated users can update ingredients"
    ON ingredients FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert recipe_ingredients" ON recipe_ingredients;
CREATE POLICY "Authenticated users can insert recipe_ingredients"
    ON recipe_ingredients FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update recipe_ingredients" ON recipe_ingredients;
CREATE POLICY "Authenticated users can update recipe_ingredients"
    ON recipe_ingredients FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete recipe_ingredients" ON recipe_ingredients;
CREATE POLICY "Authenticated users can delete recipe_ingredients"
    ON recipe_ingredients FOR DELETE
    USING (auth.role() = 'authenticated');

-- =====================================================
-- SAMPLE DATA - Ingredients
-- =====================================================
INSERT INTO ingredients (name, category) VALUES
    ('Dandelion Greens', 'herb'),
    ('Wild Garlic', 'herb'),
    ('Olive Oil', 'oil'),
    ('Lemon Juice', 'citrus'),
    ('Salt', 'seasoning'),
    ('Black Pepper', 'seasoning'),
    ('Wild Berries', 'fruit'),
    ('Dark Chocolate', 'pantry'),
    ('Honey', 'sweetener'),
    ('Almonds', 'nut'),
    ('Almond Flour', 'flour'),
    ('Mixed Vegetables', 'vegetable'),
    ('Herbs', 'herb'),
    ('Walnuts', 'nut'),
    ('Wild Mushrooms', 'mushroom'),
    ('Butter', 'dairy'),
    ('Cream', 'dairy'),
    ('Parsley', 'herb'),
    ('Thyme', 'herb'),
    ('Pine Nuts', 'nut')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SAMPLE DATA - Guides
-- =====================================================
INSERT INTO guides (title, description, content, icon, category, tags) VALUES
(
    'Getting Started with Foraging',
    'Learn the basics of safe and sustainable foraging practices.',
    E'# Getting Started with Foraging\n\n## Introduction\nForaging is the ancient practice of gathering wild food from nature. This guide will teach you the fundamentals.\n\n## Safety First\n- Never eat anything you cannot positively identify\n- Start with easily identifiable plants\n- Learn from experienced foragers\n\n## Best Seasons\n- Spring: Wild greens and shoots\n- Summer: Berries and flowers\n- Fall: Mushrooms and nuts\n- Winter: Roots and evergreens\n\n## Essential Tools\n- Field guide\n- Basket or bag\n- Knife or scissors\n- Camera for documentation',
    '🌿',
    'beginner',
    ARRAY['beginner', 'safety', 'basics']
),
(
    'Mushroom Foraging Safety',
    'Critical information for safe mushroom foraging.',
    E'# Mushroom Foraging Safety\n\n## Warning\nMushroom foraging can be dangerous. Many edible mushrooms have poisonous lookalikes.\n\n## Golden Rules\n1. Never eat a mushroom you cannot identify with 100% certainty\n2. Learn one species at a time\n3. Use multiple identification methods\n4. Get expert verification for your first finds\n\n## Identification Methods\n- Spore prints\n- Gill structure\n- Cap shape and color\n- Habitat and season\n- Smell and texture\n\n## Common Edible Mushrooms\n- Chanterelles\n- Morels\n- Chicken of the Woods\n- Lion''s Mane',
    '🍄',
    'safety',
    ARRAY['safety', 'mushrooms', 'identification']
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SAMPLE DATA - Recipes
-- =====================================================
INSERT INTO recipes (title, slug, description, category, prep_time, cook_time, servings, difficulty, icon, image, instructions, published) VALUES
(
    'Dandelion Green Salad',
    'dandelion-green-salad',
    'A fresh and nutritious salad featuring foraged dandelion greens with a zesty lemon dressing.',
    'salads',
    15,
    0,
    4,
    'easy',
    '🥗',
    '/images/recipes/veggie-bowl.jpg',
    E'1. Wash dandelion greens thoroughly and pat dry\n2. Tear into bite-sized pieces and place in a large bowl\n3. Whisk together olive oil, lemon juice, salt, and pepper\n4. Toss greens with dressing just before serving\n5. Garnish with wild garlic flowers if available',
    true
),
(
    'Wild Berry Chocolate Bark',
    'wild-berry-chocolate-bark',
    'Decadent dark chocolate bark studded with foraged wild berries and crunchy almonds.',
    'desserts',
    20,
    5,
    8,
    'easy',
    '🍫',
    '/images/recipes/chocolate-bark.jpg',
    E'1. Line a baking sheet with parchment paper\n2. Melt dark chocolate in a double boiler\n3. Pour melted chocolate onto prepared sheet and spread evenly\n4. Sprinkle wild berries and chopped almonds over chocolate\n5. Drizzle with honey if desired\n6. Refrigerate until set, about 1 hour\n7. Break into pieces and serve',
    true
),
(
    'Roasted Vegetables & Almond Crackers',
    'roasted-vegetables-almond-crackers',
    'Colorful roasted vegetables served with homemade almond crackers.',
    'sides',
    20,
    35,
    6,
    'medium',
    '🥕',
    '/images/recipes/roasted-vegetables.jpg',
    E'1. Preheat oven to 400°F (200°C)\n2. Chop mixed vegetables into uniform pieces\n3. Toss with olive oil, salt, pepper, and herbs\n4. Roast for 25-30 minutes until tender and golden\n5. For crackers: Mix almond flour with water and salt\n6. Roll thin and cut into squares\n7. Bake crackers at 350°F for 10-12 minutes\n8. Serve vegetables warm with crackers',
    true
),
(
    'Wild Mushroom Risotto',
    'wild-mushroom-risotto',
    'Creamy risotto with foraged wild mushrooms and fresh herbs.',
    'mains',
    15,
    30,
    4,
    'medium',
    '🍄',
    '/images/recipes/food-photography.jpg',
    E'1. Clean and slice wild mushrooms\n2. Sauté mushrooms in butter until golden\n3. In another pan, toast rice with olive oil\n4. Add warm broth gradually, stirring constantly\n5. Stir in cooked mushrooms and fresh herbs\n6. Finish with butter and grated cheese\n7. Season with salt and pepper to taste',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SAMPLE DATA - Recipe Ingredients
-- =====================================================

-- Dandelion Green Salad (recipe_id: 1)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, optional, notes)
SELECT 1, id, '4 cups', false, 'washed and dried' FROM ingredients WHERE name = 'Dandelion Greens'
UNION ALL
SELECT 1, id, '3 tablespoons', false, 'extra virgin' FROM ingredients WHERE name = 'Olive Oil'
UNION ALL
SELECT 1, id, '2 tablespoons', false, 'freshly squeezed' FROM ingredients WHERE name = 'Lemon Juice'
UNION ALL
SELECT 1, id, 'to taste', false, '' FROM ingredients WHERE name = 'Salt'
UNION ALL
SELECT 1, id, 'to taste', false, 'freshly ground' FROM ingredients WHERE name = 'Black Pepper'
UNION ALL
SELECT 1, id, '2 cloves', true, 'minced' FROM ingredients WHERE name = 'Wild Garlic'
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;

-- Wild Berry Chocolate Bark (recipe_id: 2)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, optional, notes)
SELECT 2, id, '12 oz', false, '70% cacao' FROM ingredients WHERE name = 'Dark Chocolate'
UNION ALL
SELECT 2, id, '1 cup', false, 'fresh or frozen' FROM ingredients WHERE name = 'Wild Berries'
UNION ALL
SELECT 2, id, '1/2 cup', false, 'chopped' FROM ingredients WHERE name = 'Almonds'
UNION ALL
SELECT 2, id, '2 tablespoons', true, 'for drizzling' FROM ingredients WHERE name = 'Honey'
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;

-- Roasted Vegetables & Almond Crackers (recipe_id: 3)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, optional, notes)
SELECT 3, id, '4 cups', false, 'assorted colors' FROM ingredients WHERE name = 'Mixed Vegetables'
UNION ALL
SELECT 3, id, '3 tablespoons', false, '' FROM ingredients WHERE name = 'Olive Oil'
UNION ALL
SELECT 3, id, 'to taste', false, '' FROM ingredients WHERE name = 'Salt'
UNION ALL
SELECT 3, id, 'to taste', false, '' FROM ingredients WHERE name = 'Black Pepper'
UNION ALL
SELECT 3, id, '2 tablespoons', false, 'mixed dried herbs' FROM ingredients WHERE name = 'Herbs'
UNION ALL
SELECT 3, id, '2 cups', false, 'for crackers' FROM ingredients WHERE name = 'Almond Flour'
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;

-- Wild Mushroom Risotto (recipe_id: 4)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, optional, notes)
SELECT 4, id, '2 cups', false, 'cleaned and sliced' FROM ingredients WHERE name = 'Wild Mushrooms'
UNION ALL
SELECT 4, id, '3 tablespoons', false, '' FROM ingredients WHERE name = 'Butter'
UNION ALL
SELECT 4, id, '2 tablespoons', false, 'chopped' FROM ingredients WHERE name = 'Parsley'
UNION ALL
SELECT 4, id, '1 tablespoon', false, 'fresh leaves' FROM ingredients WHERE name = 'Thyme'
UNION ALL
SELECT 4, id, 'to taste', false, '' FROM ingredients WHERE name = 'Salt'
UNION ALL
SELECT 4, id, 'to taste', false, '' FROM ingredients WHERE name = 'Black Pepper'
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ingredients_updated_at ON ingredients;
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guides_updated_at ON guides;
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPFUL QUERIES
-- =====================================================

-- Get recipes with their ingredients
-- SELECT
--     r.id, r.title,
--     json_agg(json_build_object(
--         'ingredient', i.name,
--         'quantity', ri.quantity,
--         'optional', ri.optional,
--         'notes', ri.notes
--     )) as ingredients
-- FROM recipes r
-- JOIN recipe_ingredients ri ON r.id = ri.recipe_id
-- JOIN ingredients i ON ri.ingredient_id = i.id
-- GROUP BY r.id, r.title;

-- Find recipes by ingredient
-- SELECT DISTINCT r.*
-- FROM recipes r
-- JOIN recipe_ingredients ri ON r.id = ri.recipe_id
-- JOIN ingredients i ON ri.ingredient_id = i.id
-- WHERE i.name ILIKE '%mushroom%';
