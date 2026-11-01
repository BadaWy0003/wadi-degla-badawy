# Coding rules

## Workflow
- Branch from latest `main`: `fix/<thing>`, `feat/<thing>`, `chore/<thing>`, `seo/<thing>`. One logical change per commit.
- Commit messages are Conventional-Commit style, as already used in the history: `fix(server): ...`, `feat(client-next): ...`, `seo: ...`, `chore: ...`, `ci: ...`.
- Before opening a PR, run `npm run build` in client-next for any website change, start the server locally for any server change, and check the affected pages in EN + AR (and mobile width).
- PR descriptions have no "Generated with Claude Code" line.

## Naming and structure (client-next)
- One folder per section: `src/components/<Section>/<Section>.js` + `<Section>.css` (PascalCase). Data lists live next to the component: `<Section>Data.js` / `<Section>ImageData.js`.
- Route wrappers: `app/[lang]/<kebab-case>/page.js`, which only exports `generateMetadata` and renders the component.
- Internal links use `LangLink` (never a bare `<a href="/...">`), so the language is kept.
- Visible text comes from `t('section.key')`, never hardcoded strings. This includes alerts, buttons and alt text.

## Styling
- Plain global CSS per component (no CSS modules or Tailwind). Prefix class names with the section (`.quarries-card`, ...) to avoid collisions.
- For RTL, add `html[dir="rtl"] .your-class { ... }` overrides where direction matters, and prefer `margin-inline-start` / `padding-inline-end` over left/right.
- Mobile first: check 375 px wide with no horizontal scroll.

## Adding a translation key
1. Add it to `client-next/translations/en.json`.
2. Add the same key path to the other 11 files (ar, fr, es, de, it, ro, ko, sq, ru, ja, zh), with a real translation. Leave no key missing.
3. Page titles and descriptions go in `<section>.pageTitle` and `<section>.metaDescription`, used by `generateMetadata`.

## Adding a page
1. Create `src/components/<Section>/` with the component and CSS.
2. Create `app/[lang]/<slug>/page.js`, copying an existing wrapper (e.g. `quarries/page.js`). Use `buildAlternates('/<slug>', lang)`.
3. Add translation keys in all 12 languages, plus navbar/footer links if needed.
4. Add the path to `STATIC_PAGES` in `app/sitemap.js` (the sitemap is generated at build time).

## Adding content (quarry, project, news, machinery...)
- Images: convert to WebP with `node tools/optimize-images.js` (max 1600 px). Keep each image under ~300 KB and put it in `public/Assets/Media/<Section>/<kebab-name>/`. Use new filenames when replacing an image (1-year cache).
- Add the entry to the section's data file and its text keys to all translations.
- Products and gallery items are **not** in the repo. They're added through the admin dashboard (Firebase).

## Server
- Validate every request body (Joi is already used in `server/src/validations/`).
- Never return raw error objects to the client, and never log request bodies (they can contain passwords).
- Public endpoints that send email or do heavy work need rate limiting.

## Safety
- Never commit `.env` files, credentials or tokens.
- Ask before: installing or removing dependencies, major upgrades, deleting files, touching `fly.toml`, Dockerfiles, workflows or nginx config, merging, deploying, or changing Fly secrets or Firebase data.
