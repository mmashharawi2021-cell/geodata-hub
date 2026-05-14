# GeoData Hub MVP Design

## Product Summary

GeoData Hub is a central Arabic-first Web GIS platform for cataloging, previewing, searching, and downloading spatial datasets from one managed place. The MVP focuses on a credible first production slice: a public discovery experience, an interactive map, a searchable spatial catalog, a layer details page, and a restricted admin workflow for adding new layers.

The MVP is intentionally narrower than the full platform vision. It prioritizes reliable metadata, clean layer previews, secure file access, and a professional GIS-oriented interface over advanced ingestion pipelines or heavy server-side geoprocessing.

## Goals

- Give users one reliable place to find and preview spatial datasets.
- Let admins add and manage core metadata and upload source files safely.
- Support public vs restricted data access with explicit role gates.
- Make the first release Arabic RTL, responsive, and visually credible for municipalities and engineering teams.
- Keep the stack fully free-tier friendly.

## Non-Goals For MVP

- Automated ingestion for `KML`, `KMZ`, `Shapefile ZIP`, or `Excel`.
- Server-side format conversion between all GIS formats.
- Full approval workflow with multiple review stages.
- Public sharing links with expiring tokens.
- Raster tiling, vector tile generation, or spatial analytics services.
- PDF metadata export.
- Large-file streaming or background processing workers.

## Recommended Technical Architecture

### Frontend

- `React 19`
- `TypeScript`
- `Vite`
- `React Router`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide React`
- `Framer Motion`
- `MapLibre GL JS`
- `TanStack Query`
- `Zustand` for small app UI state

### Backend Platform

- `Supabase Postgres`
- `PostGIS`
- `Supabase Auth`
- `Supabase Storage`
- `Row Level Security`

### Hosting

- `Vercel` for the frontend
- `Supabase` for database, auth, and storage

### Why This Stack

`Supabase + PostGIS` is the most professional free-tier fit for this project class. The platform needs structured metadata, access control, file storage, and spatially aware evolution later. `Firebase` is weaker for this exact GIS repository pattern because spatial querying, structured joins, and RLS-style governance are less natural there.

## Product Scope Decomposition

The full vision spans several subsystems:

1. Public discovery experience
2. Interactive map experience
3. Metadata catalog
4. Admin data management
5. Permissions and auditing
6. File ingestion and data quality

The first build cycle covers a production-worthy MVP across all six, but only in their lightest useful form.

## MVP Feature Set

### Public

- Home page with platform positioning and summary stats
- Map page with base map, layer toggles, transparency slider, search, popups, and layer attribute preview
- Catalog page with search, filters, sorting, and pagination
- Layer details page with metadata and map preview
- Dark mode and light mode

### Authenticated

- Login page
- Favorite layers

### Admin

- Admin dashboard overview
- Add new layer form
- Upload `GeoJSON` and `CSV`
- Metadata management for categories, source, license, visibility, and status
- Activity logging for create and download actions

## Users And Permissions

### Visitor

- Browse public catalog
- Open layer details
- Preview public layers on map
- Download public files only

### Registered User

- All visitor permissions
- Save favorites

### Data Editor

- All registered permissions
- Create new layer records
- Upload allowed files
- Edit draft layers they own or are assigned

### Admin

- All editor permissions
- Publish or hide layers
- Manage categories and data sources
- View activity log

### Super Admin

- Full access across records and roles

## Page Structure

- `/` home
- `/map` interactive map
- `/catalog` data catalog
- `/layers/:slug` layer details
- `/login` login
- `/favorites` saved layers
- `/admin` admin dashboard
- `/admin/layers/new` add layer

Admin edit screens, category management, and user management can be added in phase two after the MVP is stable.

## Information Architecture

### Home

- Hero
- Mission/value section
- Live platform statistics
- Featured categories
- Recent layers
- CTA to catalog and map

### Map

- Full-page GIS shell
- Layer panel
- Search panel
- Legend and metadata side sheet
- Basemap area

### Catalog

- Search bar
- Filter bar
- Sort selector
- Grid/list of layer cards
- Pagination

### Layer Details

- Header summary
- Metadata cards
- Mini map preview
- Download block
- Usage rights block

### Admin

- KPI cards
- Recent activity
- Draft and recent layers
- Quick action to add layer

## Spatial Data Strategy

### Canonical Rule

For the MVP, the original uploaded file is stored in `Supabase Storage`, while the previewable map representation is standardized as `GeoJSON`.

### Supported Upload Formats In MVP

- `GeoJSON`
- `CSV` with latitude/longitude columns

### CSV Rule

CSV uploads are accepted only when coordinate columns can be mapped confidently. The importer will require latitude and longitude field selection if auto-detection is not enough.

### Preview Rule

Every accepted layer must produce a lightweight preview GeoJSON object for the map. Large source data must not be loaded directly into the public map view.

## Database Design

### `profiles`

- `id`
- `email`
- `full_name`
- `role`
- `created_at`
- `updated_at`

### `categories`

- `id`
- `name`
- `slug`
- `description`
- `created_at`

### `data_sources`

- `id`
- `name`
- `description`
- `contact_info`
- `created_at`

### `layers`

- `id`
- `name`
- `slug`
- `description`
- `category_id`
- `geometry_type`
- `source`
- `license`
- `crs`
- `file_url`
- `preview_geojson_url`
- `records_count`
- `file_size`
- `status`
- `is_public`
- `created_by`
- `created_at`
- `updated_at`
- `bbox`
- `quality_summary`

### `layer_files`

- `id`
- `layer_id`
- `storage_path`
- `file_name`
- `file_type`
- `file_format`
- `file_size`
- `is_preview`
- `created_at`

### `downloads`

- `id`
- `layer_id`
- `user_id`
- `download_format`
- `created_at`

### `activity_logs`

- `id`
- `actor_id`
- `action_type`
- `target_type`
- `target_id`
- `target_name`
- `details`
- `created_at`

### `favorites`

- `id`
- `user_id`
- `layer_id`
- `created_at`

### `access_requests`

- `id`
- `layer_id`
- `user_id`
- `message`
- `status`
- `created_at`

## Data Model Notes

- `source` remains on `layers` because it was explicitly requested and should not be renamed.
- `file_url` and `preview_geojson_url` are retained as requested, even if storage paths are also stored separately in `layer_files`.
- `status` values for MVP: `draft`, `published`, `archived`.
- `license` values for MVP: `open`, `internal`, `private`.
- `geometry_type` values for MVP: `point`, `line`, `polygon`, `raster`, `tabular`.

## Security Model

### Database

- Public users can read only `published` and `is_public = true` layers.
- Authenticated users can read additional records only if policy explicitly allows.
- Editors can create layers but cannot publish them unless elevated.
- Admin and Super Admin can manage publishing fields.

### Storage

- Public preview assets can be stored in a readable bucket or accessed via signed URLs.
- Restricted original files must stay in a protected bucket.
- File types and max size are validated before upload.

### Application

- Admin routes are role-protected.
- Downloads for restricted data are blocked in UI and enforced again in policies.
- Sensitive actions create activity logs.

## Data Quality In MVP

The quality check is lightweight but explicit:

- geometry exists or can be generated
- geometry type recognized
- coordinate columns valid for CSV
- CRS known or defaulted and flagged
- empty field ratio summarized
- duplicate row suspicion counted for simple tabular imports
- preview size sanity checked

The first release stores a short `quality_summary` string or JSON-like summary for later expansion.

## UI And Visual Direction

### Design Principles

- Arabic RTL first
- formal GIS product feel
- modern but not flashy
- clear information hierarchy
- minimal clutter
- responsive by design

### Visual Language

- deep navy as the structural color
- petroleum blue for map/data surfaces
- turquoise for primary interactive accents
- snow white and soft gray for balanced contrast
- restrained glass panels over darker surfaces

### Typography

- `IBM Plex Sans Arabic` for the main UI
- clear numeric treatment for stats and metadata
- strong heading hierarchy

### Component Patterns

- translucent navigation and filter bars
- clear metadata cards
- compact admin tables or lists
- right-aligned forms with strong labels
- skeletons for loading
- empty states for no results
- toasts for success and failure
- confirmation dialog before destructive actions

## Application Structure

```text
src/
  app/
  assets/
  components/
    map/
    catalog/
    layer/
    layout/
    shared/
    ui/
  data/
  features/
    auth/
    catalog/
    layers/
    map/
    admin/
    favorites/
  firebase/          # not used in this project
  hooks/
  lib/
  pages/
  services/
  stores/
  styles/
  types/
  utils/
```

Because this build will use Supabase instead of Firebase, the `firebase/` folder from the generic template is intentionally omitted in implementation and replaced with a `lib/supabase/` or `services/supabase/` boundary.

## Core Frontend Modules

- app shell and routing
- theme provider and RTL support
- supabase client
- auth guard
- catalog search/filter state
- map viewer with layer control
- admin layer upload flow
- file parsing helpers for GeoJSON and CSV
- activity logging helpers

## Critical User Flows

### Public Discovery

1. User lands on home page
2. Opens catalog or map
3. Filters by category and geometry type
4. Opens layer details
5. Downloads a public file or opens map preview

### Admin Layer Creation

1. Admin logs in
2. Opens add layer form
3. Fills metadata
4. Uploads `GeoJSON` or `CSV`
5. System validates file
6. System stores source file and preview file
7. Layer saved as draft or published depending on role
8. Activity log entry created

## Deployment Design

### Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No service-role key is exposed to the frontend.

### Hosting Behavior

- Single-page app hosted on `Vercel`
- Route rewrites configured for SPA navigation
- Supabase project configured separately

## Testing Strategy

### Automated

- `npm run lint`
- `npm run build`
- focused unit tests for parsers and helpers

### Manual

- RTL layout review
- mobile catalog and map behavior
- login flow
- public download policy check
- restricted download denial check
- layer upload validation

## Risks And Tradeoffs

- PostGIS is the right long-term foundation, but true spatial ingestion pipelines still require careful phase-two design.
- CSV upload is easy to support safely; shapefile and spreadsheet ingestion are intentionally delayed to avoid fragile parsing and security debt.
- Large datasets can still strain map rendering if preview simplification is weak, so preview size control must be enforced.

## Phase Two Candidates

- `KML`, `KMZ`, `Shapefile ZIP`, `Excel`
- richer admin moderation
- metadata PDF export
- access request workflow
- advanced spatial search
- multilingual UI
- user management screens
- raster support improvements

## Build Order Recommendation

1. Project shell and design system
2. Supabase integration and auth model
3. Public pages
4. Map experience
5. Catalog filters and details page
6. Admin add-layer workflow
7. Policies, logging, and verification

## Acceptance Criteria For MVP

- Users can browse a real Arabic RTL catalog of layers.
- Public layers appear on the map with popups and metadata.
- Admin can create a layer with `GeoJSON` or `CSV`.
- Public download is allowed only for public/open datasets.
- Restricted assets are blocked by policy, not UI alone.
- The app builds cleanly and is deployable to `Vercel`.
