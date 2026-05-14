import { Outlet, useLocation } from "react-router-dom";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function AppShell() {
  const location = useLocation();
  const isMapPage = location.pathname === "/map";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        className={
          isMapPage
            ? "w-full"
            : "mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8"
        }
      >
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
