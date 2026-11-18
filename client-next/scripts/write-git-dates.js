// Writes content/.generated/git-dates.json: when each file of client-next/ last changed in git,
// and when each section of the translation / topic text files last changed. The sitemap reads
// it for <lastmod> (src/util/page-dates.js).
//
// Runs before every build (npm "prebuild"). The Fly Docker build has no .git, so the deploy
// workflow runs this script first (with the full history) and the file travels with the code
// into the Docker build. Without git, the script keeps an existing file and changes nothing.
//
//   { "files":    { "src/components/Home/Home.js": "2026-11-17T…", … },
//     "sections": { "translations/ar.json": { "about": "2026-11-12T…", … }, … } }
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..'); // client-next/
const OUT = path.join(ROOT, 'content/.generated/git-dates.json');

const git = (args) => {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 256 * 1024 * 1024,
    }).trim();
  } catch {
    return null;
  }
};

if (git(['rev-parse', '--is-inside-work-tree']) !== 'true') {
  console.log(
    `[git-dates] no git history here: ${fs.existsSync(OUT) ? 'keeping' : 'no'} ${path.relative(ROOT, OUT)}`,
  );
  process.exit(0);
}
if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
  // A shallow clone would date every file to the last commit: better no dates than wrong ones.
  console.log('[git-dates] shallow clone (fetch-depth: 0 needed): no page dates');
  fs.rmSync(OUT, { force: true });
  process.exit(0);
}

// Newest commit date of every file (the first time a file shows up, walking newest first).
const files = {};
let date = null;
for (const line of (
  git(['log', '--format=@%cI', '--name-only', '--relative', '--', '.']) || ''
).split('\n')) {
  if (line.startsWith('@')) date = line.slice(1);
  else if (line && !(line in files)) files[line] = date;
}

// Per JSON file: the date of the last commit that changed each top-level section.
const sectionDates = (file) => {
  const dates = {};
  const log = git(['log', '--format=%H %cI', '--', file]);
  if (!log) return dates;
  let previous = {};
  for (const line of log.split('\n').filter(Boolean).reverse()) {
    const [hash, when] = line.split(' ');
    let json;
    try {
      json = JSON.parse(git(['show', `${hash}:./${file}`]));
    } catch {
      continue;
    }
    const now = Object.fromEntries(Object.entries(json).map(([k, v]) => [k, JSON.stringify(v)]));
    for (const k of Object.keys(now)) if (previous[k] !== now[k]) dates[k] = when;
    previous = now;
  }
  return dates;
};
const sections = {};
for (const dir of ['translations', 'content/topics']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((n) => n.endsWith('.json'))) {
    sections[`${dir}/${f}`] = sectionDates(`${dir}/${f}`);
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ files, sections }));
console.log(
  `[git-dates] ${Object.keys(files).length} files, ${Object.keys(sections).length} text files`,
);
