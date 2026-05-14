import { Link, NavLink } from "react-router-dom";
import {
  Database,
  Layers3,
  LayoutDashboard,
  LogIn,
  Map,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { to: "/", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/catalog", label: "الكتالوج", icon: Database },
  { to: "/map", label: "الخريطة", icon: Map },
  { to: "/admin", label: "الإدارة", icon: ShieldCheck },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/86 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-sm">
            <Layers3 size={20} strokeWidth={2.2} />
          </span>
          <div>
            <div className="text-base font-bold text-slate-950">GeoData Hub</div>
            <div className="text-xs font-medium text-slate-500">
              مركز تشغيل البيانات الجغرافية
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")
                }
                to={item.to}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <Link
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          to="/login"
        >
          <LogIn size={16} />
          دخول
        </Link>
      </div>
    </header>
  );
}
