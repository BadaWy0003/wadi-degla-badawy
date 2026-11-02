require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'https://admin.wadidegla-eg.com',
  'https://app.wadidegla-eg.com',
  'https://www.wadidegla-eg.com',
  'https://wadidegla-eg.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://admin-dashboard-withered-waterfall-6127.fly.dev',
  'https://client-rough-dawn-8020.fly.dev',
  'https://client-next-wadi-degla.fly.dev',
  // Staging (fly.staging.toml in each app)
  'https://wadi-degla-site-staging.fly.dev',
  'https://wadi-degla-admin-staging.fly.dev',
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./start/routes')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;

