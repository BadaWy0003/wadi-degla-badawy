const ProductDetailsService = require('../services/product-details.service');

const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json({ data: await fn(req) });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Product details error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const who = (req) => req.user?.email || req.user?.id || null;

module.exports = {
  listPublic: handle(() => ProductDetailsService.listPublic()),
  get: handle((req) => ProductDetailsService.get(req.params.id)),
  save: handle((req) => ProductDetailsService.save(req.params.id, req.body, who(req))),
  importExisting: handle((req) => ProductDetailsService.importExisting(who(req))),
};
