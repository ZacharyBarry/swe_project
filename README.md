# swe_project
Project

## Local PDF viewer

Open Drawings and choose a PDF from your computer. Use Previous and Next for multipage files. PDF.js renders the pages locally; choose Save drawing to upload it after configuring Supabase. Saved PDFs can be reopened from Saved drawings after refreshing. Password-protected files are not supported yet.

The viewer code is in `src/features/drawings`: `DrawingsPage.tsx` handles file selection, `PdfViewer.tsx` opens the document and handles page navigation, and `PdfPage.tsx` renders one page.


## Supabase PDF storage

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to configure the database, private bucket, and backend environment variables. Run all commands from this `swe_project` folder.
