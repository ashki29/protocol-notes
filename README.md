# Protocol Notes

A minimal personal notes app with user-defined categories, each containing a single editable plain-text note. Built with Next.js + TypeScript and stored locally on-device via IndexedDB.

## Features

- Local-only storage (no backend)
- User-defined categories with CRUD operations
- One note per category with manual save
- Works as an installable PWA

## Setup

### Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (category list)
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
│   └── storage/
│       └── local.ts         # IndexedDB helpers
```

## Verification Checklist

1. **Create category**: Add new category, verify it appears
2. **Rename category**: Rename a category, verify change persists
3. **Delete category**: Delete with confirmation, verify removal
4. **Edit note**: Open category, type text, save, refresh, verify persistence
5. **PWA install**: Add to home screen on Android and confirm it opens standalone
