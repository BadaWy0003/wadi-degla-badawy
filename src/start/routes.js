const IndexRouter = require("../routes/index.route");
const AuthRouter = require("../routes/auth.route");
const UserRouter = require("../routes/user.route");

module.exports = function (app) {
  app.use("/api/index", IndexRouter);
  app.use("/api/auth", AuthRouter);
  app.use("/api/user", UserRouter);
};
