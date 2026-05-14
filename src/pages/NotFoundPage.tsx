import { Link } from "react-router-dom";
import { Map, ArrowLeft, Compass } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)] flex items-center justify-center mx-auto">
          <Compass className="w-10 h-10 text-[#22d3ee]" />
        </div>

        <div>
          <h1 className="text-5xl font-extrabold text-[var(--foreground)]">404</h1>
          <p className="text-base font-bold mt-2">الصفحة غير موجودة</p>
          <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          <Link to="/catalog" className="btn-ghost">
            <Map className="w-5 h-5" />
            استعرض الكتالوج
          </Link>
        </div>
      </div>
    </div>
  );
}
