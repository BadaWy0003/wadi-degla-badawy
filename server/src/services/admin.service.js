const { Firestore } = require('@google-cloud/firestore');
const hashPassword = require('../utils/password-hasher');
const { col } = require('../start/data-area');

const firestore = new Firestore();
const adminsCollection = firestore.collection(col('admins'));
const customersCollection = firestore.collection(col('customers'));

const AdminService = {};

// Create Admin
AdminService.createAdmin = async (adminData) => {
  const { username, email, password, role } = adminData;

  // Check if email already exists in admins or customers collection
  const adminSnapshot = await adminsCollection.where('email', '==', email).get();
  const customerSnapshot = await customersCollection.where('email', '==', email).get();

  if (!adminSnapshot.empty || !customerSnapshot.empty) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newAdmin = {
    username,
    email,
    password: hashedPassword,
    role,
    createdAt: Firestore.Timestamp.now(),
  };

  const docRef = await adminsCollection.add(newAdmin);
  newAdmin.id = docRef.id;

  // Remove password before returning
  delete newAdmin.password;

  return { newAdmin };
};

// Delete Admin
AdminService.deleteAdmin = async (adminId, userId) => {
  const adminDoc = await adminsCollection.doc(adminId).get();

  if (!adminDoc.exists) {
    throw new Error("User doesn't exist");
  }

  const adminData = adminDoc.data();

  if (adminId === userId) {
    throw new Error("You can't delete yourself");
  }

  await adminsCollection.doc(adminId).delete();

  return { message: 'Admin deleted successfully', deletedAdmin: adminData };
};

// Get Admin By ID (Excluding Password)
AdminService.getAdminByIdAndExcludePassword = async (adminId) => {
  const adminDoc = await adminsCollection.doc(adminId).get();

  if (!adminDoc.exists) {
    throw new Error('Admin not found');
  }

  const adminData = adminDoc.data();
  delete adminData.password; // Exclude password

  return { id: adminDoc.id, ...adminData };
};

// Get Admin By ID
AdminService.getAdminById = async (adminId) => {
  const adminDoc = await adminsCollection.doc(adminId).get();

  if (!adminDoc.exists) {
    throw new Error('Admin not found');
  }

  const { password, ...adminData } = adminDoc.data(); // Exclude the password field
  return { id: adminDoc.id, ...adminData };
};

// Fetch All Admins
AdminService.fetchAllAdmin = async () => {
  const snapshot = await adminsCollection.get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const { password, ...adminData } = doc.data(); // Exclude the password field
    return { id: doc.id, ...adminData };
  });
};


// Update Admin
AdminService.currentAdminUpdate = async (adminId, newAdmin) => {
  const adminDoc = await adminsCollection.doc(adminId).get();

  if (!adminDoc.exists) {
    throw new Error("User doesn't exist");
  }

  // Only the username can be changed here; the rest of the document is left as it is.
  const changes = { username: newAdmin.username, updatedAt: Firestore.Timestamp.now() };
  await adminsCollection.doc(adminId).update(changes);

  const { password, ...adminData } = { ...adminDoc.data(), ...changes }; // never send the hash
  return { id: adminId, ...adminData };
};

module.exports = AdminService;
