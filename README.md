# Happy Foraging - Next.js

A modern, SEO-optimized website for wild food recipes and foraging guides built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Server-Side Rendering (SSR)** - Optimized for SEO and performance
- **SEO-Friendly URLs** - Recipes use slugs like `/recipes/wild-berry-chocolate-bark`
- **Admin Panel** - Full CRUD interface for recipes and guides
- **WYSIWYG Markdown Editor** - Rich text editor for recipe instructions and guide content
- **Image Upload** - Upload multiple images per recipe with Supabase Storage
- **Primary Images** - Flag images as primary for featured sections and cards
- **Image Galleries** - Beautiful photo galleries on recipe detail pages
- **Ingredient System** - Searchable ingredients with auto-creation
- **Filter by Ingredients** - Find recipes based on what you have
- **Database Migrations** - Easy schema management with Supabase CLI
- **Category Filtering** - Browse recipes by category
- **Responsive Design** - Mobile-first design that works on all devices
- **Authentication** - Secure admin login with Supabase Auth
- **Tailwind CSS** - Custom color scheme matching happyforaging.com

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel or Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project set up
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials from https://app.supabase.com/project/_/settings/api

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

### Option A: Using Supabase CLI (Recommended) ⭐

1. **Link to your project** (one-time):
```bash
npm run db:link
```

2. **Apply migrations**:
```bash
npm run db:push
```

That's it! See [DATABASE-MIGRATIONS.md](./DATABASE-MIGRATIONS.md) for more details.

### Option B: Manual SQL

1. Go to your Supabase project dashboard
2. Run the SQL from `supabase-schema.sql` in the SQL Editor
3. This will create all tables and populate them with sample data

## Project Structure

```
happy-foraging-next/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles with Tailwind
│   ├── recipes/           # Recipe routes
│   │   ├── page.tsx       # Recipe list page
│   │   └── [id]/          # Dynamic recipe pages
│   │       └── page.tsx
│   ├── guides/            # Foraging guides page
│   │   └── page.tsx
│   └── about/             # About page
│       └── page.tsx
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── RecipeCard.tsx
├── lib/                   # Utilities and libraries
│   └── supabase.ts        # Supabase client and helpers
├── public/                # Static assets
│   └── images/            # Images (logos, recipes, etc.)
└── tailwind.config.ts     # Tailwind configuration
```

## Color Scheme

The site uses the authentic Happy Foraging color palette:

- **Primary Green**: `#4b916d`
- **Dark Green**: `#0d4f3d`
- **Light Green**: `#97c693`
- **Cream Background**: `#fef6ed`
- **Accent Orange**: `#ff8044`

See `tailwind.config.ts` for the complete color configuration.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Migrations
- `npm run db:link` - Link to Supabase project (one-time)
- `npm run db:push` - Apply migrations to database
- `npm run db:pull` - Pull schema changes from remote
- `npm run db:migrate <name>` - Create new migration
- `npm run db:diff <name>` - Generate migration from changes

## Features to Add

- [ ] User authentication
- [ ] Recipe submission form
- [ ] Comments on recipes
- [ ] Favorites/bookmarks
- [ ] Advanced search with filters
- [ ] Recipe ratings
- [ ] Social sharing
- [ ] Newsletter signup
- [ ] Blog functionality

## Migration from Vanilla JS

This project is the Next.js version of the original vanilla JavaScript Happy Foraging site. Key improvements:

- Better SEO with server-side rendering
- Faster page loads with code splitting
- Dynamic routing for recipes
- Built-in image optimization
- TypeScript for type safety
- Better developer experience

## License

All rights reserved - Happy Foraging
