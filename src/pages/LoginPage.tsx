import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { env } from "@/lib/env";

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-white/10 dark:bg-slate-950/45 dark:text-white";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginDemoAs, loginWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nextPath =
    (location.state as { from?: string } | null)?.from ?? "/admin";

  return (
    <section className="surface mx-auto grid max-w-4xl overflow-hidden rounded-lg md:grid-cols-[0.95fr_1.05fr]">
      <aside className="dark-panel p-8">
        <div className="inline-flex rounded-md bg-white/12 p-3 text-cyan-100">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-white">تسجيل الدخول</h1>
        <p className="mt-4 text-sm leading-7 text-slate-200">
          دخول الإدارة والعمليات المحمية. الصلاحيات الحقيقية يجب أن تبقى في
          Supabase RLS وليس في الواجهة فقط.
        </p>
        <div className="mt-8 space-y-3 text-sm text-slate-200">
          <div className="flex items-center gap-3">
            <UserRound className="size-4 text-cyan-200" />
            مدير، محرر بيانات، أو مستخدم مخول
          </div>
          <div className="flex items-center gap-3">
            <LogIn className="size-4 text-cyan-200" />
            تحويل تلقائي للصفحة المطلوبة بعد الدخول
          </div>
        </div>
      </aside>

      <div className="bg-white p-8 dark:bg-slate-950/70">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          بيانات الحساب
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          استخدم حساب الإدارة المرتبط بالمشروع، أو جرّب وضع المدير المحلي في
          بيئة التطوير.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");

            try {
              await loginWithPassword(email, password);
              navigate(nextPath, { replace: true });
            } catch (caughtError) {
              setError(
                caughtError instanceof Error
                  ? caughtError.message
                  : "تعذر تسجيل الدخول.",
              );
            }
          }}
        >
          <input
            className={inputClass}
            placeholder="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className={inputClass}
            placeholder="كلمة المرور"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-100">
              {error}
            </p>
          ) : null}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950"
            type="submit"
          >
            <LogIn className="size-4" />
            دخول
          </button>
        </form>

        {env.isDemoMode ? (
          <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-300/20 dark:bg-teal-300/10">
            <p className="text-sm leading-7 text-teal-900 dark:text-teal-100">
              لم يتم ضبط مفاتيح Supabase بعد. يمكنك تفعيل وضع مدير محلي لمراجعة
              لوحة الإدارة ومسار الرفع.
            </p>
            <button
              className="mt-4 rounded-md border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 dark:border-teal-200/25 dark:bg-white/5 dark:text-teal-100"
              type="button"
              onClick={() => {
                loginDemoAs("admin");
                navigate(nextPath, { replace: true });
              }}
            >
              تفعيل مدير محلي
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
