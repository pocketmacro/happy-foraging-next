# Supabase Database Setup Instructions

## Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Sign in to your account
3. Select your project: `jfybqfqxethprtvnkuvj`
4. Navigate to **Settings** → **API**

### Copy These Values:

**Project URL** (you already have this):
```
https://jfybqfqxethprtvnkuvj.supabase.co
```

**Publishable Key** (YOU NEED THIS):
- Look for "Publishable key" (formerly called "anon public" key)
- This key is safe to use in the browser with Row Level Security enabled
- It should be ~300 characters long
- Starts with `eyJ...`
- Copy the ENTIRE key

### Update .env.local:

Replace the current anon key with your correct one:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jfybqfqxethprtvnkuvj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ... (paste your full PUBLISHABLE key here)
```

**Important**: Use the **Publishable key**, NOT the Secret key. The Publishable key is safe to use in the browser because Row Level Security protects your data.

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project
4. Copy the ENTIRE contents
5. Paste into the SQL Editor
6. Click **RUN** (or press Ctrl+Enter)

You should see success messages for:
- ✅ Created `ingredients` table
- ✅ Created `recipes` table
- ✅ Created `recipe_ingredients` table
- ✅ Created `guides` table
- ✅ Created indexes
- ✅ Set up Row Level Security
- ✅ Inserted sample data

## Step 3: Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - **Email**: `admin@happyforaging.com` (or your preferred email)
   - **Password**: Choose a secure password
   - **Auto Confirm User**: Check this box
4. Click **Create User**

## Step 4: Test the Connection

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3001/recipes

3. If you see recipes loading, the database is working! 🎉

4. Try logging in:
   - Go to http://localhost:3001/login
   - Use the email and password you created
   - You should be redirected to the admin panel

## Step 5: Verify Tables Were Created

In Supabase dashboard:

1. Go to **Table Editor**
2. You should see these tables:
   - `ingredients` (with ~20 sample ingredients)
   - `recipes` (with 4 sample recipes)
   - `recipe_ingredients` (linking recipes to ingredients)
   - `guides` (with 2 sample guides)

## Troubleshooting

### "Could not find the table 'public.recipes'"

This means the schema hasn't been run yet. Go back to Step 2.

### "Invalid API key"

Your Publishable key is incorrect. Make sure:
- You copied the entire key
- It starts with `eyJ...`
- It's the "Publishable" key, NOT the "Secret" key
- The Secret key should NEVER be used in the browser - it's only for server-side operations

### "Authentication failed"

Make sure you:
- Created a user in Supabase Auth
- Used the correct email/password
- Checked "Auto Confirm User" when creating

### Recipes not showing

1. Check browser console for errors (F12)
2. Verify .env.local has correct credentials
3. Restart dev server after changing .env.local
4. Check that Row Level Security policies allow public reads

## Quick Verification Checklist

- [ ] Supabase project created
- [ ] Got correct anon key (starts with eyJ...)
- [ ] Updated .env.local file
- [ ] Ran supabase-schema.sql in SQL Editor
- [ ] Created admin user in Authentication
- [ ] Dev server running
- [ ] Can see recipes at /recipes
- [ ] Can login at /login

## Next Steps

Once everything is working:

1. **Add Your Own Recipes**:
   - Login at `/login`
   - Go to `/admin/recipes`
   - Click "+ Add Recipe"
   - Add ingredients using the searchable dropdown
   - Publish!

2. **Add Foraging Guides**:
   - Go to `/admin/guides`
   - Click "+ Add Guide"
   - Write content in Markdown
   - Publish!

3. **Upload Images**:
   - For now, images go in `public/images/recipes/`
   - Update image paths in recipes to match
   - Future enhancement: direct image upload

## Need Help?

If you're stuck, check:
1. Browser console (F12) for error messages
2. Supabase logs in dashboard
3. Server logs in terminal

Common issues are usually:
- Wrong anon key
- Schema not run
- No user created
- Dev server not restarted after .env changes
