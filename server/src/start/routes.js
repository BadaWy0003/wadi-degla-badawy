const IndexRouter = require('../routes/index.route');
const AuthRouter = require('../routes/auth.route');
const CustomerRouter = require('../routes/customer.route');
const OrderRouter = require('../routes/order.route');
const AdminRouter = require('../routes/admin.route');

module.exports = (app) => {
  app.use('/api/index', IndexRouter);
  app.use('/api/auth', AuthRouter);
  app.use('/api/customer', CustomerRouter);
  app.use('/api/order', OrderRouter);
  app.use('/api/admin', AdminRouter);
};
