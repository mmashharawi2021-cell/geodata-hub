import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabase = env.isDemoMode
  ? null
  : createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
