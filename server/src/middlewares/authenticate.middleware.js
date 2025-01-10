const jwt = require('jsonwebtoken');
const { db } = require('../start/firebase'); // Import Firestore instance

// Helper functions to get Firestore collections
const customerCollection = () => db.collection('customers');
const adminCollection = () => db.collection('admins');

const customerAuth = async (req, res, next) => {
  try {
    // Retrieve the token from cookies or headers
    const token = req.cookies.auth || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Invalid Auth Token');
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Fetch the customer by ID from Firestore
    const customerSnapshot = await customerCollection().doc(decodedToken.id).get();

    if (!customerSnapshot.exists) {
      throw new Error('User not found');
    }

    // Attach customer data to the request
    req.user = { id: customerSnapshot.id, ...customerSnapshot.data() };
    next();
  } catch (err) {
    console.error('Customer Authentication Error:', err.message);
    res.status(401).send('Unauthorized. Invalid Credentials');
  }
};

const adminAuth = async (req, res, next) => {
  try {
    // Retrieve the token from cookies or headers
    const token = req.cookies.auth || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Invalid Auth Token');
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Fetch the admin by ID from Firestore
    const adminSnapshot = await adminCollection().doc(decodedToken.id).get();

    if (!adminSnapshot.exists) {
      throw new Error('User not found');
    }

    // Attach admin data to the request
    req.user = { id: adminSnapshot.id, ...adminSnapshot.data() };
    next();
  } catch (err) {
    console.error('Admin Authentication Error:', err.message);
    res.status(401).send('Unauthorized. Invalid Credentials');
  }
};

module.exports = { customerAuth, adminAuth };
