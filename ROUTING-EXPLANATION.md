# Next.js Routing Structure Explanation

## Route Groups

In Next.js App Router, folders wrapped in parentheses `()` are called **route groups**. They're used for organization but **don't appear in the URL**.

## Current Structure

```
app/
├── (dashboard)/          ← Route group (doesn't appear in URL)
│   ├── layout.tsx       ← Applies to all routes in this group
│   ├── dashboard/
│   │   └── page.tsx     → /dashboard
│   ├── campaigns/
│   │   └── page.tsx     → /dashboard/campaigns
│   ├── reply-to-reviews/
│   │   └── page.tsx     → /dashboard/reply-to-reviews
│   └── settings/
│       └── page.tsx     → /dashboard/settings
├── (auth)/              ← Another route group
│   ├── login/
│   │   └── page.tsx     → /login
│   └── signup/
│       └── page.tsx     → /signup
└── page.tsx             → / (root)
```

## Why `/dashboard/` in URLs?

The routes appear as `/dashboard/...` because:
- `app/(dashboard)/dashboard/page.tsx` creates the `/dashboard` route
- Other routes like `reply-to-reviews` are siblings in the `(dashboard)` group
- They share the same layout from `app/(dashboard)/layout.tsx`
- But they appear as separate routes: `/dashboard/reply-to-reviews`

## Why Pages Aren't Rendering

The pages aren't rendering because:

1. **Database tables don't exist yet** - The layout checks for business data
2. **Layout redirects** - When database queries fail, it redirects to `/onboarding`
3. **Need to run schema** - Run `supabase/schema-new.sql` in Supabase

## Solution

1. Run the database schema in Supabase
2. Restart your Next.js dev server
3. Pages should then render correctly

## Alternative Structure (If You Want Different URLs)

If you want routes like `/reply-to-reviews` instead of `/dashboard/reply-to-reviews`:

```
app/
├── dashboard/
│   └── page.tsx         → /dashboard
├── campaigns/
│   └── page.tsx         → /campaigns
└── reply-to-reviews/
    └── page.tsx         → /reply-to-reviews
```

But then you'd need a different layout strategy (maybe using a root layout or conditional rendering).

