# Admin Authentication Setup

The admin panel now requires authentication to access. Here's how to set it up and use it.

## What Was Added

1. **Login Page** - `/admin/login` for signing in
2. **Authentication Middleware** - Protects all `/admin/*` routes (except login)
3. **Browser-based Auth** - Uses Supabase SSR for proper session management
4. **Logout Functionality** - Sign out button in admin navigation

## Creating Your First Admin User

You need to create a user in Supabase to access the admin panel:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/jfybqfqxethprtvnkuvj
2. Click on **Authentication** in the left sidebar
3. Click on **Users** tab
4. Click **Add User** button
5. Enter:
   - Email: `your-email@example.com`
   - Password: `your-secure-password`
6. Click **Create User**

### Option 2: Using SQL

Run this in your Supabase SQL Editor:

```sql
-- This will be handled by Supabase Auth, so use the dashboard instead
```

## Logging In

1. Navigate to `http://localhost:3000/admin` (or your deployed URL + `/admin`)
2. You'll be redirected to `/admin/login`
3. Enter the email and password you created
4. Click **Sign In**
5. You'll be redirected to the admin dashboard

## How It Works

### Middleware Protection

The `middleware.ts` file checks for an active session on all `/admin/*` routes:
- **No session** → Redirects to `/admin/login`
- **Has session** → Allows access to admin pages
- **Logged in + visiting `/admin/login`** → Redirects to `/admin` dashboard

### Session Management

- Uses `@supabase/ssr` for proper cookie-based sessions
- Sessions persist across page refreshes
- Automatically handles token refresh
- Secure HttpOnly cookies

### Image Uploads

Image uploads now work because:
- The browser client (`createClientComponentClient()`) includes auth session
- Storage policies check for `auth.role() = 'authenticated'`
- Authenticated users can upload/delete images

## Logging Out

Click the **Sign Out** button in the admin navigation bar to log out. You'll be redirected to the login page.

## Security Notes

### Current Setup

- ✅ Authentication required for all admin pages
- ✅ Session-based auth with secure cookies
- ✅ Storage uploads require authentication
- ✅ Database operations require authentication (via RLS policies)

### What You Should Do

1. **Use a strong password** for your admin account
2. **Enable 2FA** in Supabase dashboard (Settings → Authentication)
3. **Set up email confirmation** (optional but recommended)
4. **Monitor auth logs** in Supabase dashboard

## Troubleshooting

### "Invalid login credentials"

- Check that you created the user in Supabase
- Verify email and password are correct
- Check Supabase Auth logs in dashboard

### Redirect loop

- Clear your browser cookies
- Check middleware is properly configured
- Verify Supabase environment variables are set

### Image upload still fails

- Verify you're logged in (check for "Sign Out" button in nav)
- Check browser console for auth errors
- Verify storage policies are applied: `npm run db:push`

### Can't access admin pages after login

- Check browser console for errors
- Verify session cookie is set (Developer Tools → Application → Cookies)
- Try logging out and back in

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jfybqfqxethprtvnkuvj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Files Modified

- `app/admin/login/page.tsx` - Login page
- `middleware.ts` - Auth protection for admin routes
- `lib/supabase.ts` - Added browser client creator
- `lib/supabase-browser.ts` - Browser client helper
- `components/admin/AdminNav.tsx` - Updated logout to use browser client
- `package.json` - Added `@supabase/ssr` dependency

## Next Steps

1. Create your admin user in Supabase
2. Restart your dev server: `npm run dev`
3. Visit `/admin` and log in
4. Try uploading an image - it should work now!

---

**Security Tip:** Never commit your `.env.local` file or share your Supabase keys publicly.
