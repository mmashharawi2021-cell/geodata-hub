import { Link, NavLink } from "react-router-dom";
import { Map, Database, Globe, User, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { env } from "@/lib/env";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/catalog", label: "الكـتالوج", icon: Database },
  { to: "/arab-data", label: "بيانات الدول العربية", icon: Globe },
  { to: "/map", label: "الخريطة", icon: Map },
];

export function SiteHeader() {
  const { profile, signOut } = useAuth();
  const { isDemoMode } = env;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 h-18">
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="glass-panel-strong rounded-2xl h-14 w-full flex items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setDrawerOpen(false)}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#0b7285] flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.2)]">
                <Map className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Geo<span className="text-[#22d3ee]">Data</span> Hub
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[rgba(34,211,238,0.1)] text-[#22d3ee] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(34,211,238,0.04)]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {isDemoMode && (
                <span className="badge badge-primary text-[0.6rem] px-2 py-0.5">
                  تجريبي
                </span>
              )}
              {profile ? (
                <div className="flex items-center gap-2">
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[rgba(34,211,238,0.1)] text-[#22d3ee]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(34,211,238,0.04)]"
                      }`
                    }
                  >
                    <User className="w-4 h-4" />
                    الإدارة
                  </NavLink>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-rose-400 hover:bg-[rgba(244,63,94,0.06)] transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    خروج
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="btn-primary btn-sm"
                >
                  <LogIn className="w-4 h-4" />
                  دخول
                </NavLink>
              )}
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(34,211,238,0.04)] transition-all duration-200"
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 glass-panel-strong rounded-l-3xl shadow-2xl animate-slide-right flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <Link to="/" className="flex items-center gap-3" onClick={() => setDrawerOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#0b7285] flex items-center justify-center">
                  <Map className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-extrabold">
                  Geo<span className="text-[#22d3ee]">Data</span> Hub
                </span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(34,211,238,0.04)] transition-all duration-200"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[rgba(34,211,238,0.1)] text-[#22d3ee]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(34,211,238,0.04)]"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-[var(--border)] space-y-2">
              {isDemoMode && (
                <span className="badge badge-primary text-[0.6rem] px-2 py-0.5 w-fit">
                  تجريبي
                </span>
              )}
              {profile ? (
                <>
                  <NavLink
                    to="/admin"
                    end
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(34,211,238,0.04)] transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    الإدارة
                  </NavLink>
                  <button
                    onClick={() => { signOut(); setDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-rose-400 hover:bg-[rgba(244,63,94,0.06)] transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    خروج
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="btn-primary btn-sm w-full justify-center"
                >
                  <LogIn className="w-4 h-4" />
                  دخول
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
