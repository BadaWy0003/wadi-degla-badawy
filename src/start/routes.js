const IndexRouter = require("../routes/index.route");
const AuthRouter = require("../routes/auth.route");
const CustomerRouter = require("../routes/customer.route");

module.exports = function (app) {
  app.use("/api/index", IndexRouter);
  app.use("/api/auth", AuthRouter);
  app.use("/api/customer", CustomerRouter);
};
