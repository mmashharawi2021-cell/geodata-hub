import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Layers3 } from "lucide-react";

export function App() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-4 px-4 text-[var(--muted)]">
          <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-lg">
            <Layers3 size={26} strokeWidth={2.2} />
          </span>
          <span className="text-sm font-semibold">جاري تحميل الواجهة...</span>
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}
