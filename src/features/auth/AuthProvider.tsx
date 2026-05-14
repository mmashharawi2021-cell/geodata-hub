import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { env } from "@/lib/env";
import {
  clearStoredDemoProfile,
  readStoredDemoProfile,
  signInWithPassword,
  signOutRemote,
  writeStoredDemoProfile,
} from "@/services/auth/authService";
import type { UserProfile, UserRole } from "@/types/auth";

interface AuthContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  loginDemoAs: (role: UserRole) => void;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (env.isDemoMode) {
      setProfile(readStoredDemoProfile());
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      isLoading,
      loginDemoAs(role) {
        const nextProfile = writeStoredDemoProfile(role);
        setProfile(nextProfile);
      },
      async loginWithPassword(email, password) {
        await signInWithPassword(email, password);
      },
      async signOut() {
        if (env.isDemoMode) {
          clearStoredDemoProfile();
          setProfile(null);
          return;
        }

        await signOutRemote();
        setProfile(null);
      },
    }),
    [isLoading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
