const ProjectsService = require('../services/projects.service');

// Known errors (statusCode set by the service) show their message; anything else is a
// generic 500 without internal details.
const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json(await fn(req));
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Projects error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const who = (req) => req.user?.email || req.user?.id || null;

const ProjectsController = {
  listPublic: handle(async () => ({ data: await ProjectsService.listPublic() })),
  listAll: handle(async () => ({ data: await ProjectsService.listAll() })),
  get: handle(async (req) => ({ data: await ProjectsService.get(req.params.id) })),
  create: handle(async (req) => ({ data: await ProjectsService.create(req.body, who(req)) })),
  update: handle(async (req) => ({ data: await ProjectsService.update(req.params.id, req.body, who(req)) })),
  setHidden: handle(async (req) => ({ data: await ProjectsService.setHidden(req.params.id, req.body.hidden, who(req)) })),
  move: handle(async (req) => ({ data: await ProjectsService.move(req.params.id, req.body.direction, who(req)) })),
  remove: handle(async (req) => ({ data: await ProjectsService.remove(req.params.id, who(req)) })),
  uploadPhotos: handle(async (req) => {
    if (!req.files?.length) throw Object.assign(new Error('No photos received.'), { statusCode: 400 });
    return { data: await ProjectsService.uploadPhotos(req.files) };
  }),
  importExisting: handle(async (req) => ({ data: await ProjectsService.importExisting(who(req)) })),
  createCountry: handle(async (req) => ({ data: await ProjectsService.createCountry(req.body, who(req)) })),
  updateCountry: handle(async (req) => ({ data: await ProjectsService.updateCountry(req.params.id, req.body, who(req)) })),
  moveCountry: handle(async (req) => ({ data: await ProjectsService.moveCountry(req.params.id, req.body.direction, who(req)) })),
  removeCountry: handle(async (req) => ({ data: await ProjectsService.removeCountry(req.params.id, who(req)) })),
};

module.exports = ProjectsController;
