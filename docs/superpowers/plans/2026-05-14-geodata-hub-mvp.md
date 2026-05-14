# GeoData Hub MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready GeoData Hub MVP as an Arabic RTL Web GIS catalog with public browsing, interactive map preview, layer details, login, and a restricted admin layer-upload flow using Supabase and MapLibre.

**Architecture:** The app is a Vite-based React SPA with a typed service boundary. Public pages read from a layer repository interface that can use Supabase or a small demo dataset when environment variables are missing. Admin flows use Supabase Auth, Storage, and database inserts. Spatial preview is standardized as GeoJSON, while metadata is stored in Postgres and governed with RLS.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Zustand, Framer Motion, MapLibre GL JS, Supabase JS, Vitest, Testing Library, Papa Parse, Zod.

---

## File Structure Map

- `package.json`
  Defines scripts and dependencies.
- `vite.config.ts`
  Vite setup, aliases, and test config.
- `components.json`
  shadcn/ui configuration.
- `index.html`
  Root HTML document with Arabic direction metadata.
- `src/main.tsx`
  App entry with providers.
- `src/App.tsx`
  Top-level router outlet composition.
- `src/app/router.tsx`
  Route tree for public and admin pages.
- `src/app/providers.tsx`
  Query client, theme, auth bootstrap, and toaster.
- `src/styles/globals.css`
  Tailwind, CSS variables, and global RTL tokens.
- `src/lib/env.ts`
  Safe environment access and demo-mode detection.
- `src/lib/supabase/client.ts`
  Browser Supabase client.
- `src/types/`
  Domain types for auth, layers, catalog, and uploads.
- `src/data/demo/`
  Small representative seed records and preview files for local development.
- `src/services/layers/`
  Repository interface, Supabase adapter, demo adapter, parser helpers.
- `src/services/auth/`
  Supabase auth helpers and role helpers.
- `src/features/home/`
  Home page sections and stats logic.
- `src/features/catalog/`
  Search, filters, sorting, and cards.
- `src/features/map/`
  MapLibre viewer, layer controls, popups, and feature search.
- `src/features/layers/`
  Layer details and download actions.
- `src/features/admin/`
  Dashboard, add-layer form, upload validation, and activity logging.
- `src/components/ui/`
  shadcn/ui primitives.
- `src/components/layout/`
  App shell, header, footer, navigation, and page containers.
- `src/components/shared/`
  Shared cards, skeletons, badges, and stat blocks.
- `src/tests/`
  Vitest setup and focused tests.
- `supabase/migrations/`
  Schema, RLS, and storage policies.
- `supabase/seed.sql`
  Minimal categories and demo records for hosted setup.
- `README.md`
  Local setup, Supabase setup, and Vercel deployment steps.

### Task 1: Scaffold the application shell and toolchain

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\package.json`
- Create: `C:\Users\mozar\Desktop\geodata hub\vite.config.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\tsconfig.json`
- Create: `C:\Users\mozar\Desktop\geodata hub\tsconfig.app.json`
- Create: `C:\Users\mozar\Desktop\geodata hub\tsconfig.node.json`
- Create: `C:\Users\mozar\Desktop\geodata hub\index.html`
- Create: `C:\Users\mozar\Desktop\geodata hub\components.json`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\main.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\App.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\app\router.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\app\providers.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\styles\globals.css`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\setup.ts`

- [ ] **Step 1: Scaffold the Vite React TypeScript project and install dependencies**

Run:

```bash
cd "C:\Users\mozar\Desktop\geodata hub"
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom @tanstack/react-query @supabase/supabase-js zustand framer-motion lucide-react maplibre-gl papaparse zod react-hook-form @hookform/resolvers date-fns sonner clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/papaparse
npx shadcn@latest init -d
npx shadcn@latest add button card badge input textarea select dropdown-menu sheet dialog tabs separator skeleton table sonner form switch
```

Expected: the repo contains `src`, `public`, `vite.config.ts`, `components.json`, and installed dependencies.

- [ ] **Step 2: Configure Vite, testing, aliases, and the HTML shell**

Write the foundation files:

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    globals: true,
  },
});
```

```html
<!-- index.html -->
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GeoData Hub</title>
  </head>
  <body class="bg-background text-foreground">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Wire the global providers, router, and root app shell**

Write the entry files:

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { AppProviders } from "@/app/providers";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
```

```tsx
// src/App.tsx
import { Outlet } from "react-router-dom";

export function App() {
  return <Outlet />;
}
```

```tsx
// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { App } from "@/App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
]);
```

```tsx
// src/app/providers.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: Add the global CSS system for Arabic RTL, theme tokens, and typography**

Write the baseline stylesheet:

```css
/* src/styles/globals.css */
@import "tailwindcss";

:root {
  color-scheme: light;
  --background: #f5f9fc;
  --foreground: #0f1f33;
  --card: rgba(255, 255, 255, 0.72);
  --primary: #0f4c81;
  --accent: #2bb7a9;
  --muted: #6d7b8c;
  --border: rgba(15, 31, 51, 0.12);
  --radius: 1.25rem;
}

.dark {
  color-scheme: dark;
  --background: #08131f;
  --foreground: #eef6ff;
  --card: rgba(10, 24, 38, 0.72);
  --primary: #4da3ff;
  --accent: #41d7c7;
  --muted: #9db1c7;
  --border: rgba(255, 255, 255, 0.12);
}

body {
  direction: rtl;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(43, 183, 169, 0.16), transparent 38%),
    linear-gradient(180deg, var(--background), color-mix(in srgb, var(--background) 84%, #ffffff 16%));
  color: var(--foreground);
  font-family: "IBM Plex Sans Arabic", system-ui, sans-serif;
}
```

- [ ] **Step 5: Add the test harness and verify the empty app boots**

Write the test setup:

```ts
// src/tests/setup.ts
import "@testing-library/jest-dom";
```

Run:

```bash
npm run build
```

Expected: Vite production build succeeds with the empty router shell.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold GeoData Hub frontend foundation"
```

### Task 2: Define core types, environment boundaries, and repository interfaces

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\src\lib\env.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\lib\supabase\client.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\types\auth.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\types\layers.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\types\catalog.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\layerRepository.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\layerFilters.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\auth\roles.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\layerFilters.test.ts`

- [ ] **Step 1: Write the failing test for catalog filtering and sorting**

```ts
// src/tests/layerFilters.test.ts
import { describe, expect, it } from "vitest";
import { applyLayerFilters } from "@/services/layers/layerFilters";
import type { LayerListItem } from "@/types/layers";

const layers: LayerListItem[] = [
  { id: "1", name: "حدود الأحياء", slug: "districts", category: "حدود إدارية", source: "البلدية", geometryType: "polygon", license: "open", isPublic: true, updatedAt: "2026-05-10T00:00:00Z", downloadsCount: 3 },
  { id: "2", name: "المدارس", slug: "schools", category: "مدارس", source: "التربية", geometryType: "point", license: "internal", isPublic: false, updatedAt: "2026-05-12T00:00:00Z", downloadsCount: 8 },
];

describe("applyLayerFilters", () => {
  it("filters by search text and sorts by newest", () => {
    const result = applyLayerFilters(layers, { query: "مدارس", category: "all", geometryType: "all", license: "all", sort: "newest" });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("schools");
  });
});
```

- [ ] **Step 2: Run the test to confirm the missing implementation fails**

Run:

```bash
npm run test -- --run src/tests/layerFilters.test.ts
```

Expected: FAIL because `applyLayerFilters` and the related types do not exist yet.

- [ ] **Step 3: Implement the typed domain model, env helper, and filter function**

Write the core boundaries:

```ts
// src/types/layers.ts
export type LayerGeometryType = "point" | "line" | "polygon" | "raster" | "tabular";
export type LayerLicense = "open" | "internal" | "private";
export type LayerStatus = "draft" | "published" | "archived";

export interface LayerListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  source: string;
  geometryType: LayerGeometryType;
  license: LayerLicense;
  isPublic: boolean;
  updatedAt: string;
  downloadsCount: number;
}
```

```ts
// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const parsed = envSchema.parse(import.meta.env);

export const env = {
  supabaseUrl: parsed.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: parsed.VITE_SUPABASE_ANON_KEY ?? "",
  isDemoMode: !parsed.VITE_SUPABASE_URL || !parsed.VITE_SUPABASE_ANON_KEY,
};
```

```ts
// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabase = env.isDemoMode
  ? null
  : createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
```

```ts
// src/services/layers/layerFilters.ts
import type { LayerListItem } from "@/types/layers";

export interface LayerFilterState {
  query: string;
  category: string;
  geometryType: string;
  license: string;
  sort: "newest" | "downloads" | "name";
}

export function applyLayerFilters(layers: LayerListItem[], filters: LayerFilterState) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const filtered = layers.filter((layer) => {
    const matchesQuery = normalizedQuery === "" || [layer.name, layer.category, layer.source].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesCategory = filters.category === "all" || layer.category === filters.category;
    const matchesGeometry = filters.geometryType === "all" || layer.geometryType === filters.geometryType;
    const matchesLicense = filters.license === "all" || layer.license === filters.license;
    return matchesQuery && matchesCategory && matchesGeometry && matchesLicense;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "downloads") return b.downloadsCount - a.downloadsCount;
    if (filters.sort === "name") return a.name.localeCompare(b.name, "ar");
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
}
```

```ts
// src/services/layers/layerRepository.ts
import type { LayerListItem } from "@/types/layers";

export interface LayerDetails extends LayerListItem {
  description: string;
  crs: string;
  fileSize: number;
  recordsCount: number;
  previewGeoJsonUrl: string;
}

export interface LayerRepository {
  listPublicLayers(): LayerListItem[];
  getLayerBySlug(slug: string): LayerDetails | null;
}
```

- [ ] **Step 4: Run the test to confirm the filter behavior now passes**

Run:

```bash
npm run test -- --run src/tests/layerFilters.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/types src/services src/tests
git commit -m "feat: add typed layer domain and filter utilities"
```

### Task 3: Build the public shell, home page, and shared layout primitives

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\src\components\layout\AppShell.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\components\layout\SiteHeader.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\components\layout\SiteFooter.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\components\shared\StatCard.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\components\shared\SectionHeading.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\data\demo\layers.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\HomePage.tsx`
- Modify: `C:\Users\mozar\Desktop\geodata hub\src\app\router.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\homePage.test.tsx`

- [ ] **Step 1: Write the failing test for the home page hero and CTA**

```tsx
// src/tests/homePage.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";

test("renders the GeoData Hub hero section", () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  expect(screen.getByRole("heading", { name: /GeoData Hub/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "استكشاف البيانات" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify the page does not exist yet**

Run:

```bash
npm run test -- --run src/tests/homePage.test.tsx
```

Expected: FAIL because `HomePage` is missing.

- [ ] **Step 3: Implement the shared layout shell and home page**

```tsx
// src/components/layout/AppShell.tsx
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function AppShell() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
```

```tsx
// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <section className="space-y-10">
      <div className="rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-950/30">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">GeoData Hub</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          منصة مركزية لإدارة واستعراض وتحميل البيانات الجغرافية من مكان واحد.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/catalog" className="rounded-full bg-[var(--primary)] px-6 py-3 text-white">
            استكشاف البيانات
          </Link>
          <Link to="/map" className="rounded-full border border-[var(--border)] px-6 py-3">
            فتح الخريطة
          </Link>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { App } from "@/App";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AppShell />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
  },
]);
```

- [ ] **Step 4: Run the home page test and then the full suite**

Run:

```bash
npm run test -- --run src/tests/homePage.test.tsx
npm run test -- --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/pages src/app src/data src/tests
git commit -m "feat: add GeoData Hub public shell and home page"
```

### Task 4: Build the catalog, layer details page, and public data repository

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\src\data\demo\layerDetails.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\demoLayerRepository.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\supabaseLayerRepository.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\index.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\catalog\CatalogFilters.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\catalog\LayerCatalogCard.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\CatalogPage.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\LayerDetailsPage.tsx`
- Modify: `C:\Users\mozar\Desktop\geodata hub\src\app\router.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\catalogPage.test.tsx`

- [ ] **Step 1: Write the failing test for catalog rendering**

```tsx
// src/tests/catalogPage.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogPage } from "@/pages/CatalogPage";

test("shows catalog filters and a layer card", async () => {
  render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  );

  expect(await screen.findByRole("heading", { name: "مكتبة البيانات" })).toBeInTheDocument();
  expect(await screen.findByText("حدود الأحياء")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify the catalog page is not implemented yet**

Run:

```bash
npm run test -- --run src/tests/catalogPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement the repository selection and catalog/detail pages**

```ts
// src/services/layers/index.ts
import { env } from "@/lib/env";
import { demoLayerRepository } from "@/services/layers/demoLayerRepository";
import { supabaseLayerRepository } from "@/services/layers/supabaseLayerRepository";

export const layerRepository = env.isDemoMode ? demoLayerRepository : supabaseLayerRepository;
```

```tsx
// src/pages/CatalogPage.tsx
import { useMemo, useState } from "react";
import { layerRepository } from "@/services/layers";
import { applyLayerFilters, type LayerFilterState } from "@/services/layers/layerFilters";
import { CatalogFilters } from "@/features/catalog/CatalogFilters";
import { LayerCatalogCard } from "@/features/catalog/LayerCatalogCard";

const initialFilters: LayerFilterState = {
  query: "",
  category: "all",
  geometryType: "all",
  license: "all",
  sort: "newest",
};

export function CatalogPage() {
  const [filters, setFilters] = useState(initialFilters);
  const layers = layerRepository.listPublicLayers();
  const visibleLayers = useMemo(() => applyLayerFilters(layers, filters), [layers, filters]);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">مكتبة البيانات</h1>
      <CatalogFilters value={filters} onChange={setFilters} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleLayers.map((layer) => (
          <LayerCatalogCard key={layer.id} layer={layer} />
        ))}
      </div>
    </section>
  );
}
```

```tsx
// src/pages/LayerDetailsPage.tsx
import { useParams } from "react-router-dom";
import { layerRepository } from "@/services/layers";

export function LayerDetailsPage() {
  const { slug = "" } = useParams();
  const layer = layerRepository.getLayerBySlug(slug);

  if (!layer) {
    return <div>الطبقة غير موجودة</div>;
  }

  return <section className="space-y-6"><h1 className="text-3xl font-bold">{layer.name}</h1></section>;
}
```

- [ ] **Step 4: Run the catalog page test and a production build**

Run:

```bash
npm run test -- --run src/tests/catalogPage.test.tsx
npm run build
```

Expected: PASS and build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data src/features src/pages src/services src/app src/tests
git commit -m "feat: add public layer catalog and details views"
```

### Task 5: Build the interactive map page and feature search without external paid services

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\map\MapView.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\map\LayerControlPanel.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\map\FeatureSearchPanel.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\map\searchPreviewFeatures.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\MapPage.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\public\data\districts.geojson`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\featureSearch.test.ts`
- Modify: `C:\Users\mozar\Desktop\geodata hub\src\app\router.tsx`

- [ ] **Step 1: Write the failing test for in-map feature search**

```ts
// src/tests/featureSearch.test.ts
import { describe, expect, it } from "vitest";
import { searchPreviewFeatures } from "@/features/map/searchPreviewFeatures";

describe("searchPreviewFeatures", () => {
  it("matches a feature by its Arabic name property", () => {
    const result = searchPreviewFeatures(
      [{ id: "1", properties: { name: "حي الزيتون" } }, { id: "2", properties: { name: "حي الرمال" } }],
      "الزيتون",
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
});
```

- [ ] **Step 2: Run the feature-search test to verify failure**

Run:

```bash
npm run test -- --run src/tests/featureSearch.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the map page, local feature search, and layer toggles**

```ts
// src/features/map/searchPreviewFeatures.ts
export function searchPreviewFeatures(features: Array<{ id: string; properties?: Record<string, unknown> }>, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return features.filter((feature) => Object.values(feature.properties ?? {}).some((value) => String(value).toLowerCase().includes(needle)));
}
```

```tsx
// src/pages/MapPage.tsx
import { FeatureSearchPanel } from "@/features/map/FeatureSearchPanel";
import { LayerControlPanel } from "@/features/map/LayerControlPanel";
import { MapView } from "@/features/map/MapView";

export function MapPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <FeatureSearchPanel />
        <LayerControlPanel />
      </aside>
      <div className="h-[70vh] overflow-hidden rounded-[2rem] border border-white/15">
        <MapView />
      </div>
    </section>
  );
}
```

Implementation notes:

```tsx
// Map requirements
// - Use OSM-compatible free basemap style with attribution
// - Load preview GeoJSON only
// - Search across loaded preview feature attributes, not external geocoding
// - Show popup with organized key/value attributes
// - Add geolocate control only if browser permission exists
```

- [ ] **Step 4: Run the feature-search test, then build**

Run:

```bash
npm run test -- --run src/tests/featureSearch.test.ts
npm run build
```

Expected: PASS and build succeeds with MapLibre imported correctly.

- [ ] **Step 5: Commit**

```bash
git add src/features src/pages src/tests public src/app
git commit -m "feat: add interactive GIS map experience"
```

### Task 6: Add auth, protected admin routing, and the admin dashboard shell

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\auth\authService.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\auth\AuthProvider.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\auth\RequireRole.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\LoginPage.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\AdminDashboardPage.tsx`
- Modify: `C:\Users\mozar\Desktop\geodata hub\src\app\providers.tsx`
- Modify: `C:\Users\mozar\Desktop\geodata hub\src\app\router.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\requireRole.test.tsx`

- [ ] **Step 1: Write the failing test for role-protected content**

```tsx
// src/tests/requireRole.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RequireRole } from "@/features/auth/RequireRole";

test("redirects viewers away from admin content", () => {
  render(
    <MemoryRouter>
      <RequireRole allow={["admin"]}>
        <div>لوحة الإدارة</div>
      </RequireRole>
    </MemoryRouter>,
  );

  expect(screen.queryByText("لوحة الإدارة")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify the role guard is missing**

Run:

```bash
npm run test -- --run src/tests/requireRole.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement auth context, login page, and protected routes**

```tsx
// src/features/auth/RequireRole.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

export function RequireRole({ allow, children }: { allow: string[]; children: React.ReactNode }) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>جاري التحقق...</div>;
  if (!profile) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!allow.includes(profile.role)) return <Navigate to="/catalog" replace />;
  return <>{children}</>;
}
```

```tsx
// src/pages/LoginPage.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  return (
    <section className="mx-auto max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
      <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
      <form className="mt-6 space-y-4">
        <Input type="email" placeholder="البريد الإلكتروني" />
        <Input type="password" placeholder="كلمة المرور" />
        <Button className="w-full">دخول</Button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run the role-guard test and the full suite**

Run:

```bash
npm run test -- --run src/tests/requireRole.test.tsx
npm run test -- --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/auth src/services/auth src/pages src/app src/tests
git commit -m "feat: add auth and protected admin shell"
```

### Task 7: Implement the admin add-layer workflow, file validation, and activity logging

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\src\features\admin\AddLayerForm.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\parseGeoJson.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\parseCsvLayer.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\services\layers\uploadLayer.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\pages\AdminNewLayerPage.tsx`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\parseGeoJson.test.ts`
- Create: `C:\Users\mozar\Desktop\geodata hub\src\tests\parseCsvLayer.test.ts`
- Modify: `C:\Users\mozar\Desktop\geodata hub\src\app\router.tsx`

- [ ] **Step 1: Write the failing tests for GeoJSON and CSV validation**

```ts
// src/tests/parseGeoJson.test.ts
import { describe, expect, it } from "vitest";
import { parseGeoJsonFile } from "@/services/layers/parseGeoJson";

describe("parseGeoJsonFile", () => {
  it("extracts a feature count and geometry type", async () => {
    const file = new File(['{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[34.4,31.5]},"properties":{"name":"موقع"}}]}'], "points.geojson", { type: "application/geo+json" });
    const result = await parseGeoJsonFile(file);
    expect(result.recordsCount).toBe(1);
    expect(result.geometryType).toBe("point");
  });
});
```

```ts
// src/tests/parseCsvLayer.test.ts
import { describe, expect, it } from "vitest";
import { parseCsvLayerFile } from "@/services/layers/parseCsvLayer";

describe("parseCsvLayerFile", () => {
  it("converts lat/lng rows into point features", async () => {
    const file = new File(["name,lat,lng\nsite,31.5,34.4"], "points.csv", { type: "text/csv" });
    const result = await parseCsvLayerFile(file);
    expect(result.recordsCount).toBe(1);
    expect(result.preview.features[0].geometry.type).toBe("Point");
  });
});
```

- [ ] **Step 2: Run the parser tests to confirm they fail first**

Run:

```bash
npm run test -- --run src/tests/parseGeoJson.test.ts src/tests/parseCsvLayer.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement the parsers and upload mutation**

```ts
// src/services/layers/parseGeoJson.ts
export async function parseGeoJsonFile(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (parsed.type !== "FeatureCollection" || !Array.isArray(parsed.features)) {
    throw new Error("ملف GeoJSON غير صالح.");
  }
  const firstGeometry = parsed.features.find((feature: any) => feature.geometry)?.geometry?.type ?? "GeometryCollection";
  return {
    recordsCount: parsed.features.length,
    geometryType: firstGeometry.toLowerCase().includes("point") ? "point" : firstGeometry.toLowerCase().includes("line") ? "line" : "polygon",
    preview: parsed,
  };
}
```

```ts
// src/services/layers/parseCsvLayer.ts
import Papa from "papaparse";

export async function parseCsvLayerFile(file: File) {
  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  const features = parsed.data.map((row, index) => ({
    type: "Feature" as const,
    id: `${index + 1}`,
    geometry: { type: "Point" as const, coordinates: [Number(row.lng ?? row.longitude), Number(row.lat ?? row.latitude)] },
    properties: row,
  }));
  return {
    recordsCount: features.length,
    geometryType: "point" as const,
    preview: { type: "FeatureCollection" as const, features },
  };
}
```

```ts
// src/services/layers/uploadLayer.ts
import { supabase } from "@/lib/supabase/client";
import { parseCsvLayerFile } from "@/services/layers/parseCsvLayer";
import { parseGeoJsonFile } from "@/services/layers/parseGeoJson";

export async function uploadLayer(payload: UploadLayerPayload) {
  if (!supabase) {
    throw new Error("بيئة Supabase غير مضبوطة.");
  }

  const parsed =
    payload.file.name.endsWith(".csv")
      ? await parseCsvLayerFile(payload.file)
      : await parseGeoJsonFile(payload.file);

  const sourceStoragePath = `layers/source/${payload.slug}/${payload.file.name}`;
  const previewStoragePath = `layers/previews/${payload.slug}.geojson`;

  const sourceUpload = await supabase.storage.from("layer-assets").upload(sourceStoragePath, payload.file, { upsert: false });
  if (sourceUpload.error) throw sourceUpload.error;

  const previewBlob = new Blob([JSON.stringify(parsed.preview)], { type: "application/geo+json" });
  const previewUpload = await supabase.storage.from("layer-assets").upload(previewStoragePath, previewBlob, { contentType: "application/geo+json", upsert: true });
  if (previewUpload.error) throw previewUpload.error;

  const layerInsert = await supabase
    .from("layers")
    .insert({
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      category_id: payload.categoryId,
      geometry_type: parsed.geometryType,
      source: payload.source,
      license: payload.license,
      crs: payload.crs,
      file_url: sourceStoragePath,
      preview_geojson_url: previewStoragePath,
      records_count: parsed.recordsCount,
      file_size: payload.file.size,
      status: payload.status,
      is_public: payload.isPublic,
      quality_summary: payload.qualitySummary,
    })
    .select("id")
    .single();

  if (layerInsert.error) throw layerInsert.error;

  const activityInsert = await supabase.from("activity_logs").insert({
    action_type: "create_layer",
    target_type: "layer",
    target_id: layerInsert.data.id,
    target_name: payload.name,
    details: { geometryType: parsed.geometryType, sourceStoragePath, previewStoragePath },
  });

  if (activityInsert.error) throw activityInsert.error;

  return layerInsert.data.id;
}
```

- [ ] **Step 4: Run the parser tests and build**

Run:

```bash
npm run test -- --run src/tests/parseGeoJson.test.ts src/tests/parseCsvLayer.test.ts
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/admin src/services/layers src/pages src/app src/tests
git commit -m "feat: add admin layer upload workflow"
```

### Task 8: Add Supabase schema, policies, README, and final verification

**Files:**
- Create: `C:\Users\mozar\Desktop\geodata hub\supabase\migrations\20260514_001_initial_schema.sql`
- Create: `C:\Users\mozar\Desktop\geodata hub\supabase\seed.sql`
- Create: `C:\Users\mozar\Desktop\geodata hub\.env.example`
- Create: `C:\Users\mozar\Desktop\geodata hub\README.md`

- [ ] **Step 1: Write the SQL schema, RLS, and storage policy files**

```sql
-- supabase/migrations/20260514_001_initial_schema.sql
create extension if not exists postgis;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'viewer' check (role in ('viewer', 'registered', 'editor', 'admin', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.layers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category_id uuid,
  geometry_type text not null,
  source text not null,
  license text not null,
  crs text not null default 'EPSG:4326',
  file_url text not null,
  preview_geojson_url text not null,
  records_count integer not null default 0,
  file_size bigint not null default 0,
  status text not null default 'draft',
  is_public boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  bbox jsonb,
  quality_summary jsonb not null default '{}'::jsonb
);

alter table public.layers enable row level security;

create policy "public can read published public layers"
on public.layers
for select
using (status = 'published' and is_public = true);
```

- [ ] **Step 2: Add the setup guide and deployment instructions**

```env
# .env.example
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

```md
<!-- README.md -->
# GeoData Hub

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run test -- --run
npm run build
```

## Deploy

1. Create a Supabase project
2. Apply `supabase/migrations/20260514_001_initial_schema.sql`
3. Configure storage buckets
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Deploy to Vercel
```

- [ ] **Step 3: Run the full verification suite**

Run:

```bash
npm run test -- --run
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 4: Commit**

```bash
git add supabase .env.example README.md
git commit -m "docs: add GeoData Hub backend schema and deployment guide"
```

## Plan Self-Review

- Spec coverage:
  - Public home, map, catalog, details, login, admin dashboard, upload flow, auth, policies, and README are covered.
  - KML/KMZ/Shapefile/Excel and PDF export remain intentionally outside the MVP and outside this plan.
- Placeholder scan:
  - No `TODO`, `TBD`, or deferred implementation markers remain in executable steps.
  - Demo mode, protected mode, map search, and upload behavior each have explicit file ownership and verification steps.
- Type consistency:
  - The plan keeps `geometryType`, `license`, `status`, `file_url`, and `preview_geojson_url` aligned with the approved spec.
