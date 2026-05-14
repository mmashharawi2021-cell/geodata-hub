import { Link } from "react-router-dom";
import { Map, Globe, User } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#0b7285] flex items-center justify-center">
                <Map className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold">
                Geo<span className="text-[#22d3ee]">Data</span> Hub
              </span>
            </Link>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-48">
              منصة رقمية لإدارة وتوزيع بيانات GIS المكانية في ليبيا.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
              التصفح
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/catalog", label: "الكـتالوج", icon: null },
                { to: "/arab-data", label: "بيانات الدول العربية", icon: Globe },
                { to: "/map", label: "الخريطة", icon: null },
                { to: "/about-owner", label: "منفذ المشروع", icon: User },
              ].map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[#22d3ee] transition-colors duration-200"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
              الحساب
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-[var(--muted)] hover:text-[#22d3ee] transition-colors duration-200"
                >
                  دخول
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-sm text-[var(--muted)] hover:text-[#22d3ee] transition-colors duration-200"
                >
                  الإدارة
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
              روابط
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://cartesian.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[#22d3ee] transition-colors duration-200"
                >
                  Cartesian
                </a>
              </li>
              <li>
                <a
                  href="https://maplibre.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[#22d3ee] transition-colors duration-200"
                >
                  MapLibre
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--muted)] text-center sm:text-right">
            © {new Date().getFullYear()} GeoData Hub. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-[var(--muted)] text-center">
            تم التصميم والتطوير بواسطة{" "}
            <Link
              to="/about-owner"
              className="font-bold text-[#22d3ee] hover:underline"
            >
              مهند أنور المشهراوي
            </Link>{" "}
            — مهندس نظم معلومات جغرافية
          </p>
        </div>
      </div>
    </footer>
  );
}
