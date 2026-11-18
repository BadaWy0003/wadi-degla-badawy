// Build-time only (app/sitemap.js): when a page really last changed, from git history, for the
// sitemap's <lastmod>. A page's date is its newest commit among:
//  - its route wrapper app/[lang]/<path>/page.js and the src/components/<Section>/ folders it
//    imports (found automatically), plus any extra files listed for it;
//  - its own sections of that language's translation file (e.g. "about" in translations/ar.json)
//    or topic text file (content/topics/<lang>.json): a change to another page's texts in the
//    same file doesn't count.
//  - the client's edits in the admin panel (Website menu): texts of its sections / topic, and the
//    data (photos, numbers, lists) of its admin blocks (`blocks`). Shared parts (menus, footer,
//    company facts, topicCommon) don't count, like the shared code. English edits count for
//    every language except Arabic when the Arabic text is written; Arabic edits for Arabic.
//    From content/.generated/site-content/changed.json (scripts/fetch-site-content.js).
// The dates come from content/.generated/git-dates.json, written before the build by
// scripts/write-git-dates.js (the Fly Docker build has no .git, so the deploy workflow writes it
// first and it is copied in with the code). Without that file every date is null and the sitemap
// leaves <lastmod> out rather than guessing. Never the build time.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd(); // client-next/

let snapshot;
function dates() {
  if (snapshot === undefined) {
    try {
      snapshot = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'content/.generated/git-dates.json'), 'utf8'),
      );
    } catch {
      snapshot = null;
    }
  }
  return snapshot;
}

// Newest commit date (ISO) of any of `files` (files or folders, relative to client-next/).
const fileDateCache = new Map();
function lastCommitDate(files) {
  const key = files.join('|');
  if (!fileDateCache.has(key)) {
    const all = dates().files;
    const found = [];
    for (const f of files) {
      const folder = f.replace(/\/$/, '') + '/';
      for (const [file, date] of Object.entries(all)) {
        if (file === f || file.startsWith(folder)) found.push(date);
      }
    }
    fileDateCache.set(key, newest(found));
  }
  return fileDateCache.get(key);
}

// For one JSON file: { sectionKey: ISO date of the last commit that changed that section }.
const sectionDates = (file) => dates().sections[file] || {};

// Newest of ISO dates / ms timestamps (git dates carry time zones, so compare as times).
const newest = (list) => {
  const times = list
    .filter(Boolean)
    .map((d) => new Date(d).getTime())
    .filter(Number.isFinite);
  return times.length ? new Date(Math.max(...times)).toISOString() : null;
};

// The admin panel's edits: { changed: { texts, data }, texts } (empty when not fetched).
let edits;
function adminEdits() {
  if (edits === undefined) {
    const read = (f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(ROOT, 'content/.generated/site-content', f), 'utf8'),
        );
      } catch {
        return null;
      }
    };
    edits = {
      changed: read('changed.json') || { texts: {}, data: {} },
      texts: read('texts.json') || {},
    };
  }
  return edits;
}

// Newest admin-panel edit that shows on this page in this language.
function adminEditDate(page, lang) {
  const { changed, texts } = adminEdits();
  const prefixes = page.topic
    ? [`topics.${page.topic}.`]
    : (page.sections || []).map((s) => `${s}.`);
  const found = [];
  for (const [key, at] of Object.entries(changed.texts || {})) {
    if (!prefixes.some((p) => key.startsWith(p))) continue;
    if (lang === 'ar') {
      found.push(at.ar);
      if (!texts[key]?.ar) found.push(at.en); // no Arabic written: the page shows the English
    } else {
      found.push(at.en);
    }
  }
  for (const block of page.blocks || []) found.push(...Object.values(changed.data?.[block] || {}));
  return newest(found);
}

// The src/components/<Section>/ folders a route wrapper imports.
function componentFolders(wrapper) {
  try {
    const src = fs.readFileSync(path.join(ROOT, wrapper), 'utf8');
    return [
      ...new Set([...src.matchAll(/src\/components\/([A-Za-z0-9]+)\//g)].map((m) => m[1])),
    ].map((name) => `src/components/${name}`);
  } catch {
    return [];
  }
}

/**
 * page: { path, sections?: [translation sections], topic?: topic key, files?: [extra files],
 *         blocks?: [admin panel blocks whose data (photos, numbers, lists) is on the page] }
 * Returns the ISO date of the page's last real change in `lang`, or null when unknown.
 */
export function pageLastModified(page, lang) {
  if (!dates()) return null;
  const wrapper = `app/[lang]${page.path}/page.js`;
  const codeDate = lastCommitDate([wrapper, ...componentFolders(wrapper), ...(page.files || [])]);
  const texts = page.topic
    ? [sectionDates(`content/topics/${lang}.json`)[page.topic]]
    : (page.sections || []).map((s) => sectionDates(`translations/${lang}.json`)[s]);
  return newest([codeDate, ...texts, adminEditDate(page, lang)]);
}
