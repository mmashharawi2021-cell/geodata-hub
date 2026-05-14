import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export function App() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 text-slate-200">
          جاري تحميل الواجهة...
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}
