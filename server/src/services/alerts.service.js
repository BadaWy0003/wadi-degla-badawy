// Error emails to the tech team (Phase 3, 2026-11-21). Sent through the same Zoho account as
// the website forms, to ALERT_EMAIL (default tech@wadidegla-eg.com). Each kind of alert is
// sent at most once per hour (counted per server machine), so a bad hour gives one email,
// not hundreds. Staging never sends alerts.
//
// Alerts: an enquiry whose email failed (it is still saved in the admin panel), a website
// update ("Publish to website") that failed, and repeated server errors (500).

const nodemailer = require('nodemailer');
const { IS_STAGING } = require('../start/data-area');

const TO = process.env.ALERT_EMAIL || 'tech@wadidegla-eg.com';
const ONCE_PER_MS = 60 * 60 * 1000;
const lastSent = new Map(); // kind -> time

let transporter;
const mailer = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_PASSWORD },
    });
  }
  return transporter;
};

const Alerts = {};

// kind: short id used for the once-per-hour limit. Never throws.
Alerts.send = async (kind, subject, lines) => {
  if (IS_STAGING || !process.env.ZOHO_EMAIL) return false;
  const now = Date.now();
  if (now - (lastSent.get(kind) || 0) < ONCE_PER_MS) return false;
  lastSent.set(kind, now);
  const text = [
    ...lines,
    '',
    `Time: ${new Date(now).toUTCString()}`,
    'Similar alerts are paused for one hour after this one.',
    '(Automatic message from the Wadi Degla website server.)',
  ].join('\n');
  try {
    await mailer().sendMail({ from: process.env.ZOHO_EMAIL, to: TO, subject: `[Website alert] ${subject}`, text });
    return true;
  } catch (e) {
    console.error(`[alerts] "${kind}" not sent:`, e.message);
    return false;
  }
};

// Repeated server errors: 5 answers with status 500+ within 10 minutes.
const ERROR_WINDOW_MS = 10 * 60 * 1000;
const ERROR_COUNT = 5;
let errors = [];
Alerts.serverErrors = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 500) return;
    const now = Date.now();
    errors = errors.filter((e) => now - e.at < ERROR_WINDOW_MS);
    errors.push({ at: now, line: `${res.statusCode} ${req.method} ${String(req.originalUrl || '').split('?')[0]}` });
    if (errors.length >= ERROR_COUNT) {
      const list = errors.map((e) => `- ${new Date(e.at).toISOString().slice(11, 19)} UTC  ${e.line}`);
      errors = [];
      Alerts.send('server-errors', 'The server is answering with errors', [
        `The API answered ${list.length} requests with a server error in the last 10 minutes:`,
        '',
        ...list,
        '',
        'Check the server logs: fly logs -a server-withered-wildflower-1595 --no-tail',
      ]);
    }
  });
  next();
};

module.exports = Alerts;
