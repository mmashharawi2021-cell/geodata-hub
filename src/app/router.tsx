import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/App";
import { RequireRole } from "@/features/auth/RequireRole";
import { AppShell } from "@/components/layout/AppShell";

const HomePage = lazy(() =>
  import("@/pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const CatalogPage = lazy(() =>
  import("@/pages/CatalogPage").then((module) => ({
    default: module.CatalogPage,
  })),
);
const LayerDetailsPage = lazy(() =>
  import("@/pages/LayerDetailsPage").then((module) => ({
    default: module.LayerDetailsPage,
  })),
);
const MapPage = lazy(() =>
  import("@/pages/MapPage").then((module) => ({ default: module.MapPage })),
);
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/AdminDashboardPage").then((module) => ({
    default: module.AdminDashboardPage,
  })),
);
const AdminNewLayerPage = lazy(() =>
  import("@/pages/AdminNewLayerPage").then((module) => ({
    default: module.AdminNewLayerPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const ArabDataPage = lazy(() =>
  import("@/pages/ArabDataPage").then((module) => ({
    default: module.ArabDataPage,
  })),
);
const AboutOwnerPage = lazy(() =>
  import("@/pages/AboutOwnerPage").then((module) => ({
    default: module.AboutOwnerPage,
  })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "catalog", element: <CatalogPage /> },
          { path: "layers/:slug", element: <LayerDetailsPage /> },
          { path: "map", element: <MapPage /> },
          { path: "login", element: <LoginPage /> },
          { path: "arab-data", element: <ArabDataPage /> },
          { path: "about-owner", element: <AboutOwnerPage /> },
          { path: "layers", element: <Navigate to="/catalog" replace /> },
          {
            path: "admin",
            element: (
              <RequireRole allow={["admin", "super_admin"]}>
                <AdminDashboardPage />
              </RequireRole>
            ),
          },
          {
            path: "admin/layers/new",
            element: (
              <RequireRole allow={["editor", "admin", "super_admin"]}>
                <AdminNewLayerPage />
              </RequireRole>
            ),
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
