# Onzy Academy

## Next Steps

1.  **Supabase Setup**:
    *   Create a project at https://supabase.com.
    *   Run the SQL migrations provided in your prompt in the Supabase SQL Editor.
    *   Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API.
    *   Create a `.env` file (or set in your deployment platform) with:
        ```
        VITE_SUPABASE_URL=your_url
        VITE_SUPABASE_ANON_KEY=your_key
        ```

2.  **Stripe Integration**:
    *   Deploy the Edge Functions (`stripe-checkout`, `stripe-webhook`) to Supabase.
    *   Update `lib/stripe.ts` (create this file if using real payments) to call the `stripe-checkout` function.
    *   Configure Stripe Webhooks to point to your Supabase function URL.

3.  **Deploy**:
    *   Run `npm install`.
    *   Run `npm run build`.
    *   Deploy to Vercel or Netlify.

4.  **Admin Access**:
    *   Manually update a user's `role` to `'admin'` in the `profiles` table in Supabase to access the Admin Dashboard.
