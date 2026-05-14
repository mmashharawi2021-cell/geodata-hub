import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

const envData = parsedEnv.success ? parsedEnv.data : {};

export const env = {
  supabaseUrl: envData.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: envData.VITE_SUPABASE_ANON_KEY ?? "",
  isDemoMode: !envData.VITE_SUPABASE_URL || !envData.VITE_SUPABASE_ANON_KEY,
};
