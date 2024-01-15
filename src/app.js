const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./start/routes")(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`Server started on port localhost:${port}`);
});

module.exports = server;
