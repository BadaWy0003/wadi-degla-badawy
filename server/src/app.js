const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { db } = require('./start/firebase'); // Import your Firestore instance

const app = express();

const allowedOrigins = ['http://localhost:3000'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
require('./start/routes')(app);
// require('./start/database')();
async function testFirestoreConnection() {
  try {
    // Attempt to write a test document
    const testDocRef = db.collection('test').doc('connectionCheck');
    await testDocRef.set({ connected: true, timestamp: new Date() });
    console.log('Firestore Connected...');
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
}

testFirestoreConnection();
const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;




