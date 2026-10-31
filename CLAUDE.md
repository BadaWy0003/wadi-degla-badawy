# Wadi Degla website

Live site for Wadi Degla (Egyptian marble, granite and limestone exporter): https://www.wadidegla-eg.com/en/
**`main` is production.** A merge to `main` deploys automatically (see Deployment).

## Apps in this repo
| Folder | What | Fly app | Status |
|---|---|---|---|
| `client-next/` | **Live website**, Next.js 14 App Router, static export (`output: 'export'`) served by nginx | `client-next-wadi-degla` (cdg) | live |
| `server/` | Express 4 API on Node 22: email, products/gallery, auth, PDF export | `server-withered-wildflower-1595` (fra) | live |
| `admin-dashboard/` | CRA + React 19 + MUI admin panel (products, gallery, users, PDFs) | `admin-dashboard-withered-waterfall-6127` | suspended, to be revived |
| `client/` | OLD CRA website, replaced by client-next in March 2026 | `client-rough-dawn-8020` | suspended. Do not edit |
| `tools/` | `optimize-images.js`: sharp batch converter to WebP (max 1600 px, q82) | n/a | n/a |

## Data
- **Products + gallery**: Firestore collection `materials`, with images in Firebase Storage (`uploads/<type>/...`). They're read at runtime through `GET /api/storage/all` and `GET /api/storage/type/:type`, and edited through the admin dashboard.
- **Customers / admins / documents**: Firestore collections `customers`, `admins`, `documents`.
- **Everything else is static in the repo**: page text is in `client-next/translations/*.json`. Data lists such as projects, news, quarries, machinery and certificates are JS files in `client-next/src/components/<Section>/`. Images are in `client-next/public/Assets/Media/`.
- No database or volumes on Fly. The Mongo/Prisma code in `server/` is dead.

## client-next structure
- `app/layout.js`: root layout (GA4, Organization/WebSite JSON-LD).
- `app/[lang]/layout.js`: `generateStaticParams` over `SUPPORTED_LANGS`.
- `app/[lang]/<page>/page.js`: thin wrappers that export `generateMetadata` (via `t()` / `buildAlternates()` from `src/util/meta.js`). They render the component with `dynamic(..., { ssr: false })`.
- `src/components/<Section>/<Section>.js` + `<Section>.css`: the page UI (client components).
- `src/util/supported-langs.js`: the language list.
- `src/util/client.js`: axios instance using `NEXT_PUBLIC_BASE_API_URL`.
- `src/components/LangLink.js`: use this for internal links. It prefixes `/{lang}`.
- `src/Public` is a symlink to `../public`.
- `public/sitemap.xml` and `public/robots.txt` are hand-maintained static files.

## Languages (12)
`en, ar, fr, es, de, it, ro, ko, sq, ru, ja, zh` (default `en`).
- Each language has a JSON file in `client-next/translations/`, used with i18next/react-i18next (client) plus `t()` in `src/util/meta.js` for metadata (falls back to English).
- **Every new key must be added to all 12 files.** `en.json` is the source of truth.
- RTL: `src/components/AppShell.js` sets `dir="rtl"` and `lang` on the client. RTL CSS uses `html[dir="rtl"]` selectors. Arabic uses the Cairo font (`body[lang="ar"]`).
- nginx redirects `/` and any path without a language prefix to `/en/...`.

## Commands
```bash
# website
cd client-next && npm ci
NEXT_PUBLIC_BASE_API_URL=https://server-withered-wildflower-1595.fly.dev npm run dev     # http://localhost:3000/en/
NEXT_PUBLIC_BASE_API_URL=https://server-withered-wildflower-1595.fly.dev npm run build   # -> out/ (~1,700 pages)
npx serve out   # preview the static export

# server (needs the Firebase + Zoho env vars below; it crashes at startup without FIREBASE_STORAGE_BUCKET)
cd server && npm ci && npm run dev

# docker (same as Fly)
docker build --build-arg NEXT_PUBLIC_BASE_API_URL=https://server-withered-wildflower-1595.fly.dev -t wd-site client-next
docker run -p 8080:80 wd-site
```
- Lint: `cd client-next && npx next lint` (0 errors and 87 warnings as of 2026-10-31; `next build` fails on lint *errors*). `cd server && npx eslint .` (122 known problems, not yet cleaned up).
- Format: Prettier per app (`client-next/.prettierrc.json`: single quotes, width 100; `server/.prettierrc.json`; `admin-dashboard/.prettierrc`). A Claude hook (`.claude/hooks/format-edited-file.sh`) formats **only the file just edited**. Don't mass-format the repo.
- Tests: none exist.

## Deployment (Fly.io via GitHub Actions)
- `.github/workflows/deploy-*.yml` run `flyctl deploy --remote-only` on push to `main` when files in that app's folder change. Secret: `FLY_API_TOKEN`.
- **Merging to main = going live.** Never push to `main` directly. Use a branch + PR, and merge only after the owner says "merge".
- Before a deploy, note the current release: `fly releases -a <app>`.
- After a deploy: `fly status -a <app>`, `fly logs -a <app> --no-tail`, then check the affected pages in EN + AR.
- Roll back a release to its earlier image:
  ```bash
  fly releases -a <app> --image
  fly deploy -a <app> --image <image-of-good-release>
  ```
  Or `git revert` the merge commit and merge that.
- No health checks, release commands or migrations.

## Environment variables (names only)
- server (Fly secrets): `SECRET_KEY`, `ZOHO_EMAIL`, `ZOHO_PASSWORD`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `GOOGLE_APPLICATION_CREDENTIALS_BASE64`.
- server (fly.toml/Dockerfile): `PORT=3000`, `NODE_ENV=production`.
- client-next (build arg): `NEXT_PUBLIC_BASE_API_URL`. The server URL is also hardcoded in `app/[lang]/products/[productName]/page.js`.
- admin-dashboard: `REACT_APP_BASE_API_URL`.

## Third parties
GA4 `G-R2Y9CCM4YC`, Google Maps embed, WhatsApp `wa.me` link, Font Awesome 6.4 (cdnjs), flagcdn.com, amCharts, Zoho SMTP, Firebase.

## Gotchas
- `client/` duplicates most of client-next. Edit **client-next only**.
- Product pages are generated at build time from the live API (fallback: `FALLBACK_PRODUCT_SLUGS`). A product added in the admin panel only gets its own page after the next client-next deploy.
- nginx caches `/Assets/*` images for 1 year (`immutable`). **Replace an image under a new filename**, not the same one.
- Static HTML has no body content (`ssr: false`). Keep that in mind for SEO work.
- `server/.dockerignore` excludes `src/common`, so the PDF upload folder doesn't exist in the image.
- The Fly API token in cloud sessions is **read-only**: it can't deploy or change anything.
- In cloud sessions the Docker daemon isn't started by default (`dockerd &`), and Docker builds can't reach Debian mirrors through the proxy, so the server image can't be built there.
- The Fly dashboard shows a "merge new files" banner on the server app (Fly Launch GitHub link, Feb 2025). Ignore it; deploys go through GitHub Actions.
- Merging a PR that touches several app folders redeploys **each** of those apps (including the suspended `client/` and admin apps).

## Decisions log
- 2026-10-31: removed a hidden `process.exit` trigger from `server/src/controllers/storage.controller.js` (PR #2, server release v247).
- 2026-10-31: the admin dashboard will be revived. `client/` is considered retired.
- PR descriptions must **not** include the "Generated with Claude Code" line.
- Staging (separate Fly apps + a separate free Firebase project) will be set up when the admin-dashboard revival starts.
- Formatting: format-on-edit only (no repo-wide reformat).
