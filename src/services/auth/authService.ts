import { env } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";
import type { UserProfile, UserRole } from "@/types/auth";

const DEMO_PROFILE_KEY = "geodata-hub-demo-profile";

export function readStoredDemoProfile() {
  if (!env.isDemoMode) {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_PROFILE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    window.localStorage.removeItem(DEMO_PROFILE_KEY);
    return null;
  }
}

export function writeStoredDemoProfile(role: UserRole) {
  const profile: UserProfile = {
    id: `demo-${role}`,
    email: `${role}@local.demo`,
    fullName: role === "admin" ? "مدير محلي" : "مستخدم محلي",
    role,
  };

  window.localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function clearStoredDemoProfile() {
  window.localStorage.removeItem(DEMO_PROFILE_KEY);
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error("بيئة Supabase غير مضبوطة.");
  }

  const result = await supabase.auth.signInWithPassword({ email, password });
  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function signOutRemote() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
