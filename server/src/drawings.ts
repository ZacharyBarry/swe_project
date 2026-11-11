import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const TEST_PROJECT_ID = '00000000-0000-4000-8000-000000000001';
export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export type Sheet = { id: string; project_id: string; filename: string; storage_path: string; created_at: string };
export interface DrawingStore {
  list(): Promise<Sheet[]>;
  save(filename: string, bytes: Buffer): Promise<Sheet>;
  open(id: string): Promise<{ filename: string; bytes: ArrayBuffer } | null>;
}

// Backend only. Never put the secret key in frontend code.
export function createDrawingStore(): DrawingStore {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase is not configured. Follow README.md and restart the backend.');
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return {
    async list() {
      const { data, error } = await supabase.from('sheets').select('*')
        .eq('project_id', TEST_PROJECT_ID).order('created_at', { ascending: false });
      if (error) throw error;
      return data as Sheet[];
    },
    async save(filename, bytes) {
      const id = randomUUID();
      const storage_path = `${TEST_PROJECT_ID}/${id}.pdf`;
      const { error: uploadError } = await supabase.storage.from('drawings')
        .upload(storage_path, bytes, { contentType: 'application/pdf', upsert: false });
      if (uploadError) throw uploadError;
      // Remove the file if its database record cannot be saved.
      try {
        const { data, error } = await supabase.from('sheets').insert({
          id, project_id: TEST_PROJECT_ID, filename, storage_path,
        }).select().single();
        if (error) throw error;
        return data as Sheet;
      } catch (error) {
        const { error: cleanupError } = await supabase.storage.from('drawings').remove([storage_path]);
        if (cleanupError) console.error('Upload cleanup failed; remove storage object:', storage_path);
        throw error;
      }
    },
    async open(id) {
      const { data, error } = await supabase.from('sheets').select('*')
        .eq('id', id).eq('project_id', TEST_PROJECT_ID).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const { data: file, error: fileError } = await supabase.storage.from('drawings').download(data.storage_path);
      if (fileError) throw fileError;
      return { filename: data.filename, bytes: await file.arrayBuffer() };
    },
  };
}
