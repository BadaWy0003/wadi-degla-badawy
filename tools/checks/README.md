# Checks (run them before every pull request)

Three free checks, all run locally (nothing is deployed, nothing touches live data).
Each prints `RESULT: all good` and exits 0, or lists the problems and exits 1.

| Check | When | Command (from the repository root) |
|---|---|---|
| **Server** | any change in `server/` | `node tools/checks/server-check.js` |
| **SEO & links** | any website change, after the build | `python3 -I tools/checks/seo-check.py client-next/out` |
| **Phone layout** | any website change, after the build | `node tools/checks/phone-check.js client-next/out` |

Website build first (in Claude cloud sessions with `NODE_USE_ENV_PROXY=1`):

```bash
cd client-next && NODE_USE_ENV_PROXY=1 NEXT_PUBLIC_BASE_API_URL=https://server-withered-wildflower-1595.fly.dev npm run build
```

## What each one does
- **server-check.js** loads the real route files with a fake, empty database and a fake
  login, and calls 28 addresses as a visitor, a moderator and an admin, comparing each answer
  with the expected one (public pages work, admin pages refuse visitors, moderators can't open
  admin-only pages, bad input is refused). **Add a line to `CHECKS` when you add a route.**
  Needs `npm ci` in `server/`.
- **seo-check.py** reads every built page: broken internal links and photos, missing or too
  long titles/descriptions, canonical, one H1, photos without alt, duplicate titles or
  descriptions per language, sitemap and hreflang. The second argument (a file name) saves the
  outside links (Firebase photos, WhatsApp...) as JSON to check them with curl.
- **phone-check.js** opens 31 pages (every main page plus one stone, project and news page)
  in English and Arabic on an iPhone 13 and a 360 px phone (Playwright + Chromium, which
  Claude cloud sessions have): sideways scrolling, things wider than the screen, overlapping
  text, text under 12 px, the H1 under the header. iPhone screenshots go to the second
  argument (default: a temporary folder). Findings checked by hand and accepted are listed in
  `KNOWN` at the top of the script. It checks the layout; a real iPhone (Safari) can still differ.
