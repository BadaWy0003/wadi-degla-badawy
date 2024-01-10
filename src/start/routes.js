const IndexRouter = require("../routes/index.route");
const AuthRouter = require("../routes/auth.route");

module.exports = function (app) {
  app.use("/index", IndexRouter);
  app.use("/auth", AuthRouter);
};
