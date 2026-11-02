// "Publish to website": starts the website's normal deploy workflow on GitHub
// (.github/workflows/deploy-client-next.yml, workflow_dispatch on main). The build reads
// the news from GET /api/news, so the published site matches the database.
//
// Needs the Fly secret GITHUB_DEPLOY_TOKEN: a fine-grained GitHub token limited to this
// repository with "Actions: Read and write" permission (nothing else).

const { IS_STAGING } = require('../start/data-area');
const NewsService = require('./news.service');

const REPO = process.env.GITHUB_REPO || 'BadaWy0003/wadi-degla-badawy';
const WORKFLOW = process.env.GITHUB_DEPLOY_WORKFLOW || 'deploy-client-next.yml';
const MIN_INTERVAL_MS = 60 * 1000; // one publish per minute is plenty (builds take ~5 minutes)

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const github = (path, options = {}) =>
  fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_DEPLOY_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'wadi-degla-admin',
      ...(options.headers || {}),
    },
  });

const PublishService = {};

PublishService.isConfigured = () => !!process.env.GITHUB_DEPLOY_TOKEN && !IS_STAGING;

PublishService.publish = async (by) => {
  if (IS_STAGING) throw httpError(400, 'Publishing is disabled on staging.');
  if (!process.env.GITHUB_DEPLOY_TOKEN) throw httpError(503, 'Publishing is not set up yet (GITHUB_DEPLOY_TOKEN is missing).');

  const meta = await NewsService.getMeta();
  if (meta.lastPublishAt && Date.now() - meta.lastPublishAt < MIN_INTERVAL_MS) {
    throw httpError(429, 'A publish was just started. Please wait a minute.');
  }

  const res = await github(`/actions/workflows/${WORKFLOW}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({ ref: 'main' }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status !== 204) {
    console.error('Publish: GitHub answered', res.status);
    throw httpError(502, 'GitHub refused to start the website update. Please try again later.');
  }

  const startedAt = Date.now();
  await NewsService.setMeta({ lastPublishAt: startedAt, lastPublishBy: by || null });
  return { startedAt };
};

// Last website build started from the admin panel (or by hand on GitHub) and whether
// there are changes that are not on the website yet.
PublishService.status = async () => {
  const meta = await NewsService.getMeta();
  const result = {
    configured: PublishService.isConfigured(),
    lastChangeAt: meta.lastChangeAt || null,
    lastPublishAt: meta.lastPublishAt || null,
    lastPublishBy: meta.lastPublishBy || null,
    unpublishedChanges: !!meta.lastChangeAt && (!meta.lastPublishAt || meta.lastChangeAt > meta.lastPublishAt),
    run: null,
  };
  if (!result.configured) return result;
  try {
    const res = await github(`/actions/workflows/${WORKFLOW}/runs?event=workflow_dispatch&per_page=1`);
    if (res.ok) {
      const run = (await res.json()).workflow_runs?.[0];
      if (run) result.run = { status: run.status, conclusion: run.conclusion, startedAt: run.run_started_at, url: run.html_url };
    }
  } catch (e) {
    console.error('Publish status: GitHub unreachable:', e.message);
  }
  return result;
};

module.exports = PublishService;
