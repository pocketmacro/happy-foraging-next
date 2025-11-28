# Quick Start Guide - 3 Steps to Get Running

## Step 1: Get Your Supabase Publishable Key

1. Go to: https://app.supabase.com/project/jfybqfqxethprtvnkuvj/settings/api
2. Copy the **Publishable key** (starts with `eyJ...`)
   - ⚠️ Use "Publishable" NOT "Secret"
3. Paste it into `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste your key here>
   ```

## Step 2: Run the Database Schema

### Option A: Using Supabase CLI (Recommended) ⭐

1. **Link to your Supabase project**:
   ```bash
   npm run db:link
   ```
   - Enter your database password when prompted
   - Find it in: Supabase Dashboard → Settings → Database → Connection String

2. **Push the schema**:
   ```bash
   npm run db:push
   ```
   - Done! Your database is set up ✅

### Option B: Manual SQL (Alternative)

1. Go to: https://app.supabase.com/project/jfybqfqxethprtvnkuvj/sql/new
2. Copy **ALL** contents of `supabase-schema.sql` file
3. Paste into the SQL Editor
4. Click **RUN** (or Ctrl+Enter)
5. Wait for success messages ✅

**Note**: Option A is better because you can easily make future database changes! See `DATABASE-MIGRATIONS.md` for details.

## Step 3: Create Your Admin User

1. Go to: https://app.supabase.com/project/jfybqfqxethprtvnkuvj/auth/users
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `admin@happyforaging.com` (or your email)
   - Password: (choose a secure password)
   - ✅ Check "Auto Confirm User"
4. Click **Create User**

## Test It!

Your dev server should already be running. Visit:

- **Recipes Page**: http://localhost:3001/recipes
- **Login Page**: http://localhost:3001/login
- **Admin Panel**: http://localhost:3001/admin

If you need to restart the dev server:
```bash
npm run dev
```

## What You Get

✅ 4 sample recipes with ingredients
✅ 20+ ingredients in the database
✅ 2 foraging guides
✅ Full admin interface
✅ SEO-friendly URLs
✅ Ingredient-based recipe filtering

## Need More Help?

See `SETUP-INSTRUCTIONS.md` for detailed step-by-step guide with troubleshooting.
