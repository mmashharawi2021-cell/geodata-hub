import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { env } from "@/lib/env";

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
    <section className="mx-auto max-w-md rounded-[2rem] border border-white/12 bg-white/8 p-8 backdrop-blur-xl dark:bg-slate-950/30">
      <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        دخول الإدارة والعمليات المحمية. في وضع التطوير المحلي يمكنك تفعيل دور
        إداري مؤقت لتجربة الواجهة.
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
          className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none placeholder:text-slate-400"
          placeholder="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white outline-none placeholder:text-slate-400"
          placeholder="كلمة المرور"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          className="w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
          type="submit"
        >
          دخول
        </button>
      </form>

      {env.isDemoMode ? (
        <div className="mt-6 rounded-2xl border border-cyan-300/18 bg-cyan-300/8 p-4">
          <p className="text-sm text-cyan-100">
            لم يتم ضبط مفاتيح Supabase بعد. يمكنك تفعيل وضع مدير محلي لمراجعة
            لوحة الإدارة ومسار الرفع.
          </p>
          <button
            className="mt-4 rounded-full border border-cyan-200/25 px-4 py-2 text-sm font-medium text-cyan-100"
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
    </section>
  );
}
