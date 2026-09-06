import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const FALLBACK_URL = "https://unavailable.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.placeholder";

export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL || FALLBACK_URL,
  SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
      autoRefreshToken: Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
    },
  },
);
