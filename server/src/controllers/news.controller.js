const NewsService = require('../services/news.service');
const PublishService = require('../services/publish.service');

// Known errors (statusCode set by the services) show their message; anything else is a
// generic 500 without internal details.
const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json(await fn(req));
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('News error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const who = (req) => req.user?.email || req.user?.id || null;

const NewsController = {
  listPublic: handle(async () => ({ data: await NewsService.listPublic() })),
  listAll: handle(async () => ({ data: await NewsService.listAll() })),
  get: handle(async (req) => ({ data: await NewsService.get(req.params.id) })),
  create: handle(async (req) => ({ data: await NewsService.create(req.body, who(req)) })),
  update: handle(async (req) => ({ data: await NewsService.update(req.params.id, req.body, who(req)) })),
  setHidden: handle(async (req) => ({ data: await NewsService.setHidden(req.params.id, req.body.hidden, who(req)) })),
  setPinned: handle(async (req) => ({ data: await NewsService.setPinned(req.params.id, req.body.pinned, who(req)) })),
  remove: handle(async (req) => ({ data: await NewsService.remove(req.params.id, who(req)) })),
  uploadPhotos: handle(async (req) => {
    if (!req.files?.length) throw Object.assign(new Error('No photos received.'), { statusCode: 400 });
    return { data: await NewsService.uploadPhotos(req.files) };
  }),
  importExisting: handle(async (req) => ({ data: await NewsService.importExisting(who(req)) })),
  publish: handle(async (req) => ({ data: await PublishService.publish(who(req)) })),
  publishStatus: handle(async () => ({ data: await PublishService.status() })),
};

module.exports = NewsController;
