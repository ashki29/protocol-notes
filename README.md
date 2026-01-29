# Protocol Notes

A minimal personal notes app with user-defined categories, each containing a single editable plain-text note. Built with Next.js + TypeScript, using Supabase for Auth + Postgres + RLS.

## Features

- Email-based authentication
- User-defined categories with CRUD operations
- One note per category with auto-save
- Auto-creates 5 default categories on first login: Exercise, Diet, Supplements, Mobility, Other
- Row Level Security (RLS) ensures users can only access their own data

## Setup

### 1. Supabase Project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema from `supabase-schema.sql`
3. Go to Authentication > Providers and ensure Email auth is enabled
4. Copy your project URL and anon key from Settings > API

### 2. Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (category list)
│   ├── login/
│   │   └── page.tsx         # Login/signup page
│   └── category/
│       └── [id]/
│           └── page.tsx     # Note editor page
├── components/
│   ├── AuthForm.tsx         # Login/signup form
│   ├── CategoryList.tsx     # List of categories
│   ├── CategoryItem.tsx     # Single category with actions
│   ├── CreateCategory.tsx   # New category form
│   └── NoteEditor.tsx       # Textarea + save button
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── middleware.ts    # Auth middleware helper
│   └── actions/
│       ├── auth.ts          # Auth actions
│       ├── categories.ts    # Category CRUD
│       └── notes.ts         # Note CRUD
└── middleware.ts            # Route protection
```

## Verification Checklist

1. **Auth**: Sign up with email, log out, log back in
2. **Auto-create defaults**: On first login, verify 5 categories appear
3. **Create category**: Add new category, verify it appears
4. **Rename category**: Rename a category, verify change persists
5. **Delete category**: Delete with confirmation, verify removal
6. **Edit note**: Open category, type text, save, refresh, verify persistence
7. **RLS**: Try accessing another user's category ID in URL (should fail)
