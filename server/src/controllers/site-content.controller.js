const SiteContentService = require('../services/site-content.service');

// Known errors (statusCode set by the service) show their message; anything else is a
// generic 500 without internal details.
const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json(await fn(req));
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Site content error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const who = (req) => req.user?.email || req.user?.id || null;

const SiteContentController = {
  listPublic: handle(async () => ({ data: await SiteContentService.listPublic() })),
  listBlocks: handle(async () => ({ data: await SiteContentService.listBlocks() })),
  getBlock: handle(async (req) => ({ data: await SiteContentService.getBlock(req.params.id) })),
  saveBlock: handle(async (req) => ({ data: await SiteContentService.saveBlock(req.params.id, req.body, who(req)) })),
  listVersions: handle(async (req) => ({ data: await SiteContentService.listVersions(req.params.id) })),
  restoreVersion: handle(async (req) => ({
    data: await SiteContentService.restoreVersion(req.params.id, req.params.versionId, who(req)),
  })),
  uploadPhotos: handle(async (req) => {
    if (!req.files?.length) throw Object.assign(new Error('No photos received.'), { statusCode: 400 });
    return { data: await SiteContentService.uploadPhotos(req.files) };
  }),
};

module.exports = SiteContentController;
