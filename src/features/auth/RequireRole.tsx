import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { hasRequiredRole } from "@/services/auth/roles";
import type { UserRole } from "@/types/auth";

export function RequireRole({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="text-sm text-slate-300">جاري التحقق...</div>;
  }

  if (!profile) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/login"
      />
    );
  }

  if (!hasRequiredRole(profile.role, allow)) {
    return <Navigate replace to="/catalog" />;
  }

  return <>{children}</>;
}
