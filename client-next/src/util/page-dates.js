// Build-time only (app/sitemap.js): when a page really last changed, from git history, for the
// sitemap's <lastmod>. A page's date is its newest commit among:
//  - its route wrapper app/[lang]/<path>/page.js and the src/components/<Section>/ folders it
//    imports (found automatically), plus any extra files listed for it;
//  - its own sections of that language's translation file (e.g. "about" in translations/ar.json)
//    or topic text file (content/topics/<lang>.json): a change to another page's texts in the
//    same file doesn't count.
// Returns null when git history isn't available (the Fly Docker build has no .git), and the
// sitemap then leaves <lastmod> out rather than guessing. Never the build time.
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd(); // client-next/

function git(args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

let available;
function gitAvailable() {
  if (available === undefined) available = git(['rev-parse', '--is-inside-work-tree']) === 'true';
  return available;
}

// Newest commit date (ISO) touching any of `files` (files or folders, relative to client-next/).
const fileDateCache = new Map();
function lastCommitDate(files) {
  const key = files.join('|');
  if (!fileDateCache.has(key)) {
    const existing = files.filter((f) => fs.existsSync(path.join(ROOT, f)));
    const out = existing.length ? git(['log', '-1', '--format=%cI', '--', ...existing]) : null;
    fileDateCache.set(key, out || null);
  }
  return fileDateCache.get(key);
}

// For one JSON file: { sectionKey: ISO date of the last commit that changed that section }.
const sectionCache = new Map();
function sectionDates(file) {
  if (sectionCache.has(file)) return sectionCache.get(file);
  const dates = {};
  const log = git(['log', '--format=%H %cI', '--', file]);
  if (log) {
    // Oldest first: a section's date moves forward each time its content differs.
    const commits = log.split('\n').filter(Boolean).reverse();
    let previous = {};
    for (const line of commits) {
      const [hash, date] = line.split(' ');
      const text = git(['show', `${hash}:./${file}`]);
      if (text == null) continue;
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        continue;
      }
      for (const [k, v] of Object.entries(json)) {
        const s = JSON.stringify(v);
        if (previous[k] !== s) dates[k] = date;
      }
      previous = Object.fromEntries(Object.entries(json).map(([k, v]) => [k, JSON.stringify(v)]));
    }
  }
  sectionCache.set(file, dates);
  return dates;
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

const newest = (dates) => dates.filter(Boolean).sort().pop() || null;

/**
 * page: { path, sections?: [translation sections], topic?: topic key, files?: [extra files] }
 * Returns the ISO date of the page's last real change in `lang`, or null when unknown.
 */
export function pageLastModified(page, lang) {
  if (!gitAvailable()) return null;
  const wrapper = `app/[lang]${page.path}/page.js`;
  const codeDate = lastCommitDate([wrapper, ...componentFolders(wrapper), ...(page.files || [])]);
  const texts = page.topic
    ? [sectionDates(`content/topics/${lang}.json`)[page.topic]]
    : (page.sections || []).map((s) => sectionDates(`translations/${lang}.json`)[s]);
  return newest([codeDate, ...texts]);
}
