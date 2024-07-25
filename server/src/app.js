const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./start/routes')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});

module.exports = server;
