const admin = require('firebase-admin');
const fs = require('node:fs');
const path = require('node:path');

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
  const credentialsBuffer = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64');
  const tempPath = path.join('/tmp', 'firebase-credentials.json');
  fs.writeFileSync(tempPath, credentialsBuffer);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
}

admin.initializeApp({
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

module.exports = { db, bucket };

