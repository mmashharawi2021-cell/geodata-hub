import { env } from "@/lib/env";
import { demoLayerRepository } from "@/services/layers/demoLayerRepository";
import { supabaseLayerRepository } from "@/services/layers/supabaseLayerRepository";

export const layerRepository = env.isDemoMode
  ? demoLayerRepository
  : supabaseLayerRepository;
