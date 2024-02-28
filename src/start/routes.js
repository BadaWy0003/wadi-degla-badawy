const IndexRouter = require('../routes/index.route');
const AuthRouter = require('../routes/auth.route');
const UserRouter = require('../routes/user.route');
const InvoiceRouter = require('../routes/order.route');

module.exports = (app) => {
  app.use('/api/index', IndexRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/user', UserRouter);
  app.use('/api/order', InvoiceRouter);
};
