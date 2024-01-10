const IndexRouter = require("../routes/index.route");

module.exports = function (app) {
  app.use("/index", IndexRouter);
};
