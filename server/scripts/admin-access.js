#!/usr/bin/env node
// Admin account helper for when nobody can log in to the admin dashboard.
// It must run ON the server machine, because it uses the server's Firebase secrets:
//
//   fly ssh console -a server-withered-wildflower-1595
//   node /app/scripts/admin-access.js list
//   node /app/scripts/admin-access.js reset-password someone@example.com
//
//   node /app/scripts/admin-access.js create someone@example.com
//
// On the staging app (fly ssh console -a wadi-degla-server-staging) the same commands work
// on the staging admins (collection staging_admins), so production admins are never touched.
//
// `list` shows admin emails/usernames/roles (never passwords).
// `create` adds a SUPER_ADMIN (asks for a username and a hidden password), e.g. the first
// admin of a fresh staging environment.
// `reset-password` asks for a new password (hidden, typed twice), checks it against
// the same rules the login form uses, and stores its bcrypt hash for that one admin.

const readline = require('readline');
const { col, IS_STAGING } = require('../src/start/data-area');
const { loginCustomerReqSchema } = require('../src/validations/customer.validation.schema');
const hashPassword = require('../src/utils/password-hasher');

const PASSWORD_RULES = '8-16 characters with an upper-case letter, a lower-case letter, a number and a symbol';

const formatDate = (value) => {
  if (!value) return '-';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toISOString().slice(0, 10);
};

async function listAdmins(db, log = console.log) {
  const snapshot = await db.collection(col('admins')).get();
  if (snapshot.empty) {
    log('No admin accounts found.');
    return [];
  }
  const admins = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      email: data.email,
      username: data.username || '-',
      role: data.role || '-',
      created: formatDate(data.createdAt),
    };
  });
  log(`${admins.length} admin account(s):`);
  admins.forEach((a) => log(`  ${a.email}  | username: ${a.username} | role: ${a.role} | created: ${a.created}`));
  return admins;
}

async function resetPassword(db, email, newPassword, log = console.log) {
  // Same validation as POST /api/auth/admin/login, so the new password is guaranteed to be accepted there.
  const { error } = loginCustomerReqSchema.body.validate({ email, password: newPassword });
  if (error) {
    throw new Error(`Password not accepted: use ${PASSWORD_RULES}. (${error.message})`);
  }

  const snapshot = await db.collection(col('admins')).get();
  const matches = snapshot.docs.filter((doc) => String(doc.data().email || '').toLowerCase() === email.toLowerCase());
  if (matches.length === 0) {
    throw new Error(`No admin with email ${email}. Run "list" to see the admin emails.`);
  }
  if (matches.length > 1) {
    throw new Error(`More than one admin has email ${email}; not changing anything.`);
  }

  const doc = matches[0];
  // sessionsValidAfter: logins made with the old password stop working everywhere.
  await doc.ref.update({ password: await hashPassword(newPassword), sessionsValidAfter: Date.now() });
  log(`Password updated for ${doc.data().email} (role: ${doc.data().role || '-'}).`);
  log(`Log in at ${ADMIN_URL}/login with exactly that email.`);
}

const ADMIN_URL = IS_STAGING
  ? 'https://wadi-degla-admin-staging.fly.dev'
  : 'https://admin-dashboard-withered-waterfall-6127.fly.dev';

async function createAdmin(db, { email, username, password }, log = console.log) {
  const { error } = loginCustomerReqSchema.body.validate({ email, password });
  if (error) {
    throw new Error(`Not accepted: use a valid email and ${PASSWORD_RULES}. (${error.message})`);
  }
  if (!username || username.trim().length < 2) throw new Error('Please give a username (2+ characters).');
  const snapshot = await db.collection(col('admins')).get();
  if (snapshot.docs.some((doc) => String(doc.data().email || '').toLowerCase() === email.toLowerCase())) {
    throw new Error(`An admin with email ${email} already exists. Use reset-password instead.`);
  }
  await db.collection(col('admins')).add({
    username: username.trim(),
    email,
    password: await hashPassword(password),
    role: 'SUPER_ADMIN',
    createdAt: new Date(),
  });
  log(`Created SUPER_ADMIN ${email}${IS_STAGING ? ' (staging)' : ''}.`);
  log(`Log in at ${ADMIN_URL}/login with exactly that email.`);
}

function askLine(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    // Print the question, but not the characters typed after it.
    // eslint-disable-next-line no-underscore-dangle
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function main([command, email]) {
  if (!['list', 'reset-password', 'create'].includes(command)) {
    console.log(
      'Usage:\n  node /app/scripts/admin-access.js list\n  node /app/scripts/admin-access.js reset-password <email>\n  node /app/scripts/admin-access.js create <email>',
    );
    return;
  }
  // Loaded here so the functions above can be tested without Firebase.
  const { db } = require('../src/start/firebase'); // eslint-disable-line global-require

  if (command === 'list') {
    await listAdmins(db);
    return;
  }

  if (command === 'create') {
    if (!email) throw new Error('Please give the admin email: create <email>');
    // Non-interactive use (the "Deploy Staging" setup job): the password arrives base64-encoded
    // in ADMIN_PASSWORD_B64 so its symbols survive the remote command line.
    if (process.env.ADMIN_PASSWORD_B64) {
      const password = Buffer.from(process.env.ADMIN_PASSWORD_B64, 'base64').toString('utf8');
      await createAdmin(db, { email, username: process.env.ADMIN_USERNAME || 'admin', password });
      return;
    }
    const username = await askLine('Username: ');
    console.log(`Password rules: ${PASSWORD_RULES}.`);
    const pw1 = await askHidden('Password: ');
    const pw2 = await askHidden('Repeat password: ');
    if (pw1 !== pw2) throw new Error('The two passwords are different; nothing was created.');
    await createAdmin(db, { email, username, password: pw1 });
    return;
  }

  if (!email) throw new Error('Please give the admin email: reset-password <email>');
  console.log(`New password rules: ${PASSWORD_RULES}.`);
  const first = await askHidden('New password: ');
  const second = await askHidden('Repeat new password: ');
  if (first !== second) throw new Error('The two passwords are different; nothing was changed.');
  await resetPassword(db, email, first);
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { listAdmins, resetPassword, createAdmin };
