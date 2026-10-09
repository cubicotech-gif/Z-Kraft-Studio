import type { SupabaseClient } from "@supabase/supabase-js";
import { BUCKET } from "@/lib/order-schema";

let client: SupabaseClient | undefined;

/**
 * Browser-side upload using a one-time signed token from the server. The anon key alone
 * cannot write anywhere. supabase-js is imported lazily, so it is not in the initial bundle.
 */
export async function uploadInspiration(path: string, token: string, file: File) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Uploads are not available right now.");
  if (!client) {
    const { createClient } = await import("@supabase/supabase-js");
    client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  const { error } = await client.storage.from(BUCKET).uploadToSignedUrl(path, token, file, { contentType: file.type });
  if (error) throw new Error("Upload failed. Try again.");
}
