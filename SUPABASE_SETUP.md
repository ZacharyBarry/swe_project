# Punch List starter

## Basic PDF storage setup

The browser sends the PDF to Express. Express saves the file in Supabase Storage
and its filename/project/storage path in the Supabase PostgreSQL `sheets` table.
One seeded Campus renovation project is used for now. Punch-list items are still
session-only. Login, roles, project creation, and stamps are separate next steps.

This is a local development setup. Keep the backend bound to 127.0.0.1; do not
deploy it publicly before adding login and project permissions. The secret key
can bypass database access rules, so it belongs only in the backend `.env` file.

### 1. Create your Supabase project

Sign in at https://supabase.com/dashboard and create a project. Wait for it to
finish starting. Supabase supplies both PostgreSQL and file Storage.

### 2. Create the tables and bucket

Open the project's SQL Editor, start a new query, paste `supabase/setup.sql`, and
run it. This creates `projects`, `sheets`, one sample project, and a private
`drawings` bucket limited to PDFs up to 10 MB. It enables row-level security
without anonymous access policies; requests go through Express.

This starter uses UUID IDs, not the integer IDs proposed in the old SDD.
Agree on that with teammates before building stamps/items. It uses Supabase's
JavaScript client to access PostgreSQL rather than adding Prisma at this stage.

### 3. Add your connection details

From the project dashboard's Connect dialog/settings, get the Project URL.
From Settings > API Keys, get a backend **secret key** (a legacy service_role
key also works). Do not use the publishable/anon key for this starter backend.

In the project folder:

```powershell
Copy-Item .env.example .env
```

Edit `.env` locally and replace both placeholder values. Never paste the secret
into chat, frontend code, or a `VITE_` variable. `.env` is already gitignored.
Restart the backend after changing it.

### 4. Run the app

Use Node 22 or newer. From the project root:

```powershell
npm install
npm run dev:server
```

In a second terminal in the same folder:

```powershell
npm run dev
```

Open http://127.0.0.1:5173. The frontend forwards `/api` to Express on port 3001.
Port 5173 must be free (stop the old dev server if needed).

### 5. Try saving a PDF

1. Open Drawings and choose a valid unlocked PDF under 10 MB.
2. Click **Save drawing** and wait for the saved message.
3. Refresh the page. The filename should remain under **Saved drawings**.
4. Click it to reopen the stored PDF.
5. Check Supabase: Storage > drawings holds the file; Table Editor > sheets
   holds its record. Selecting a file alone only previews it.

If the database insert fails after uploading, Express tries to remove the file.
If that cleanup also fails, the backend prints the storage path for manual cleanup.

## Files to understand

- `supabase/setup.sql`: tables, sample project, private bucket.
- `server/src/drawings.ts`: Supabase upload/list/download operations.
- `server/src/app.ts`: three routes and file validation.
- `src/features/drawings/DrawingsPage.tsx`: preview, save, and reopen controls.

Routes: GET `/api/sheets`, POST `/api/sheets?filename=plan.pdf` (raw PDF body),
GET `/api/sheets/:id/file`. Only the seeded test project is accessible.

## Checks

```powershell
npm test
npm run build
```

Automated API tests use a fake store; they do not prove your Supabase project is
configured. Complete the refresh/reopen check above after adding your credentials.

Official guide: https://supabase.com/docs/guides/storage/uploads/standard-uploads
