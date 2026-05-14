import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "الرئيسية" },
  { to: "/catalog", label: "الكتالوج" },
  { to: "/map", label: "الخريطة" },
  { to: "/admin", label: "الإدارة" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/40 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-cyan-400/15 text-lg font-bold text-cyan-200">
            GD
          </span>
          <div>
            <div className="text-lg font-semibold text-white">GeoData Hub</div>
            <div className="text-sm text-slate-300">منصة مركزية للبيانات الجغرافية</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-white/14 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            className="rounded-full border border-white/12 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            to="/login"
          >
            دخول
          </Link>
        </div>
      </div>
    </header>
  );
}
