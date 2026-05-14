import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Map, LogIn, User, Lock, AlertCircle, Database, Layers3 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { env } from "@/lib/env";

export function LoginPage() {
  const { loginWithPassword, loginDemoAs } = useAuth();
  const { isDemoMode } = env;
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    try {
      setLoading(true);
      if (isDemoMode) {
        await loginDemoAs("admin");
      } else {
        await loginWithPassword(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Database, label: "إدارة البيانات" },
    { icon: Layers3, label: "تنظيم الطبقات" },
    { icon: Map, label: "خريطة تفاعلية" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="hero-panel rounded-3xl p-8 sm:p-10">
            <div className="hero-glow-1" />
            <div className="hero-glow-2" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#0b7285] flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.15)]">
                <Map className="w-7 h-7 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold">
                  Geo<span className="text-[#22d3ee]">Data</span> Hub
                </h2>
                <p className="text-[#94b8d0] text-sm mt-2 leading-relaxed">
                  منصة متكاملة لإدارة البيانات المكانية — بواجهة عربية حديثة وتقنيات مفتوحة المصدر.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(34,211,238,0.08)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#22d3ee]" />
                    </div>
                    <span className="text-sm text-white/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel-strong rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.12)] to-[rgba(34,211,238,0.04)] flex items-center justify-center">
              <LogIn className="w-5 h-5 text-[#22d3ee]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">تسجيل الدخول</h1>
              <p className="text-xs text-[var(--muted)]">
                {isDemoMode ? "وضع تجريبي — استخدم أي بيانات" : "ادخل بيانات حسابك"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pr-10"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-400/5 border border-rose-400/10 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </form>

          {isDemoMode && (
            <div className="mt-4 p-3 rounded-xl bg-[rgba(34,211,238,0.04)] border border-[rgba(34,211,238,0.1)]">
              <p className="text-[0.65rem] text-[var(--muted)] text-center">
                أنت في <span className="font-bold text-[#22d3ee]">الوضع التجريبي</span>. أي بريد وكلمة سر ستعملان.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
