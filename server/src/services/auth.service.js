const { db } = require('../start/firebase'); // Import Firestore instance
const hashPassword = require('../utils/password-hasher');
const comparePassword = require('../utils/compare-password');
const { generateSignedCustomerToken, generateSignedAdminToken } = require('../utils/generate-token');

const AuthService = {};

// Helper functions to get collection references
const customerCollection = () => db.collection('customers');
const adminCollection = () => db.collection('admins');

// Create a new customer and generate token
AuthService.createCustomerAndGenerateToken = async (customerData) => {
  const { fullName, companyName, rnc, email, phone, whatsapp, country, countryCode, address, port, password } = customerData;

  try {
    // Check if email exists in customers or admins collection
    const emailExistAsCustomer = await customerCollection().where('email', '==', email).get();
    const emailExistAsAdmin = await adminCollection().where('email', '==', email).get();

    if (!emailExistAsCustomer.empty || !emailExistAsAdmin.empty) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    // Add new customer
    const newCustomerRef = await customerCollection().add({
      fullName,
      companyName,
      rnc: rnc || null,
      email,
      phone,
      whatsapp: whatsapp || null,
      country,
      countryCode: countryCode || null,
      address: address || null,
      port,
      password: hashedPassword,
    });

    const newCustomerSnapshot = await newCustomerRef.get();
    const newCustomer = { id: newCustomerSnapshot.id, ...newCustomerSnapshot.data() };

    // Generate token
    const token = await generateSignedCustomerToken(newCustomer.id);

    return { newCustomer, token };
  } catch (error) {
    console.error('Error creating customer:', error.message);
    throw new Error('Failed to create customer. Please try again.');
  }
};

// Login customer and generate token
AuthService.loginCustomerAndSignToken = async (customerData) => {
  const { email, password } = customerData;

  try {
    // Find customer by email
    const customerSnapshot = await customerCollection().where('email', '==', email).limit(1).get();

    if (customerSnapshot.empty) {
      throw new Error('User not found');
    }

    const customerDoc = customerSnapshot.docs[0];
    const customer = { id: customerDoc.id, ...customerDoc.data() };

    // Validate password
    const isPasswordValid = await comparePassword(password, customer.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate token
    const token = await generateSignedCustomerToken(customer.id);

    return { customer, token };
  } catch (error) {
    console.error('Error logging in customer:', error.message);
    throw new Error('Login failed. Please check your credentials.');
  }
};

// Check customer authentication
AuthService.customerCheckAuth = async (user) => {
  try {
    const customerRef = customerCollection().doc(user.id);
    const customerSnapshot = await customerRef.get();

    if (!customerSnapshot.exists) {
      return null;
    }

    const customer = { id: customerSnapshot.id, ...customerSnapshot.data() };
    delete customer.password;

    return customer;
  } catch (error) {
    console.error('Error checking customer auth:', error.message);
    throw new Error('Failed to verify authentication. Please try again.');
  }
};

AuthService.adminCheckAuth = async (user) => {
  try {
    const adminRef = adminCollection().doc(user.id);
    const adminSnapshot = await adminRef.get();

    if (!adminSnapshot.exists) {
      return null;
    }

    const admin = { id: adminSnapshot.id, ...adminSnapshot.data() };
    delete admin.password;

    return admin;
  } catch (error) {
    console.error('Error checking admin auth:', error.message);
    throw new Error('Failed to verify authentication. Please try again.');
  }
};

// Login admin and generate token
AuthService.loginAdminAndSignToken = async (adminData) => {
  const { email, password } = adminData;

  try {
    // Find admin by email
    const adminSnapshot = await adminCollection().where('email', '==', email).limit(1).get();

    if (adminSnapshot.empty) {
      throw new Error('User not found');
    }

    const adminDoc = adminSnapshot.docs[0];
    const admin = { id: adminDoc.id, ...adminDoc.data() };

    // Validate password
    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate token
    const token = await generateSignedAdminToken(admin.id, admin.role);

    return { admin, token };
  } catch (error) {
    console.error('Error logging in admin:', error.message);
    throw new Error('Login failed. Please check your credentials.');
  }
};

module.exports = AuthService;
