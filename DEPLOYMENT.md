# Deployment Guide

This guide covers deploying the Happy Foraging Next.js site to Vercel (recommended) or Netlify.

## Vercel Deployment (Recommended)

Vercel is created by the same team that builds Next.js, providing the best performance and developer experience.

### Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Supabase project set up

### Steps

1. **Push to GitHub**
   ```bash
   cd happy-foraging-next
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/happy-foraging-next.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://jfybqfqxethprtvnkuvj.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
     ```
   - **Important**: Replace the anon key with your actual key from Supabase dashboard

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a URL like `happy-foraging-next.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain (e.g., happyforaging.com)
   - Update DNS records as instructed
   - Vercel provides free SSL certificates

### Automatic Deployments

Every push to your `main` branch will automatically trigger a new deployment on Vercel.

## Netlify Deployment

### Prerequisites

- GitHub account
- Netlify account (sign up at [netlify.com](https://netlify.com))
- Supabase project set up

### Steps

1. **Push to GitHub** (same as Vercel above)

2. **Import to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Show advanced" → "New variable" to add environment variables

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jfybqfqxethprtvnkuvj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a URL like `happy-foraging-next.netlify.app`

6. **Configure for Next.js**
   - Create a `netlify.toml` file in the root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

## Supabase Setup

Before deploying, ensure your Supabase database is set up:

1. **Get Correct Credentials**
   - Go to https://app.supabase.com/project/_/settings/api
   - Copy the "Project URL" for `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the "anon/public" key (NOT the service_role key) for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - The anon key should be 300+ characters and start with `eyJ...`

2. **Create Database Tables**
   - Go to SQL Editor in Supabase dashboard
   - Run the SQL from `../happy-foraging/supabase-schema.sql`
   - This creates the `recipes` table with sample data

3. **Verify Connection**
   - After deployment, visit your site's `/recipes` page
   - Recipes should load from Supabase
   - Check browser console for any connection errors

## Post-Deployment

### Testing

1. Test all pages:
   - Homepage: `/`
   - Recipes: `/recipes`
   - Individual recipe: `/recipes/1`
   - Guides: `/guides`
   - About: `/about`

2. Test functionality:
   - Search bar on recipes page
   - Category filters
   - Recipe links
   - Mobile menu
   - Image loading

### Performance Optimization

1. **Enable Edge Caching** (Vercel)
   - Already enabled by default for static pages
   - Dynamic pages cached at edge for better performance

2. **Image Optimization**
   - Next.js automatically optimizes images
   - Images served in modern formats (WebP/AVIF)
   - Lazy loading enabled by default

3. **Analytics** (Optional)
   - Add Vercel Analytics or Google Analytics
   - Monitor page performance and user behavior

## Troubleshooting

### Build Fails

- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node version (18+ required)

### Images Not Loading

- Check that images are in `public/images/` directory
- Verify image paths start with `/images/`
- Check Next.js Image component configuration

### Supabase Connection Errors

- Verify environment variables are set correctly
- Check that anon key is the correct one (not service_role key)
- Ensure Supabase project is not paused
- Check Row Level Security policies in Supabase

### Pages Return 404

- Ensure all page files are in `app/` directory
- Check that `app/layout.tsx` exists
- Verify dynamic routes are in `[id]` format

## Monitoring

### Vercel

- Built-in analytics at vercel.com/dashboard
- Real-time logs for debugging
- Performance insights

### Netlify

- Analytics available with Pro plan
- Function logs for debugging
- Deploy notifications

## Rollback

### Vercel

- Go to Deployments tab
- Find previous successful deployment
- Click "..." → "Promote to Production"

### Netlify

- Go to Deploys tab
- Find previous deploy
- Click "Publish deploy"

## Domain Configuration

### Vercel

1. Add domain in Settings → Domains
2. Update DNS:
   - A record: `76.76.21.21`
   - Or CNAME: `cname.vercel-dns.com`
3. SSL automatically provisioned

### Netlify

1. Add domain in Domain Settings
2. Update DNS:
   - A record: Use Netlify's IP
   - Or CNAME: `yoursite.netlify.app`
3. SSL automatically provisioned

## Environment-Specific Variables

For staging vs production:

```bash
# Production (.env.production)
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co

# Staging (.env.staging)
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
```

Configure these in your deployment platform's environment variable settings.

## Continuous Deployment

Both platforms support automatic deployments:

- **Production**: Deploys on push to `main` branch
- **Preview**: Deploys on pull requests
- **Staging**: Deploy from `staging` branch (configure in settings)

## Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
