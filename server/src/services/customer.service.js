const { db } = require('../start/firebase'); // Import Firestore instance
const hashPassword = require('../utils/password-hasher');

const CustomerService = {};

// Helper function to get collection references
const customerCollection = () => db.collection('customers');
const adminCollection = () => db.collection('admins');

// Create a new customer
CustomerService.createCustomer = async (customerData) => {
  const { fullName, companyName, rnc, email, phone, whatsapp, country, countryCode, address, port, password } = customerData;

  // Check if email exists in customers or admins collection
  const emailExistAsCustomer = await customerCollection().where('email', '==', email).get();
  const emailExistAsAdmin = await adminCollection().where('email', '==', email).get();

  if (!emailExistAsCustomer.empty || !emailExistAsAdmin.empty) {
    throw new Error('Email already exists');
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

  // Fetch the newly created customer (excluding the password)
  const newCustomerSnapshot = await newCustomerRef.get();
  const newCustomer = { id: newCustomerSnapshot.id, ...newCustomerSnapshot.data() };
  delete newCustomer.password;

  return { newCustomer };
};

// Delete a customer by ID
CustomerService.deleteCustomer = async (customerId) => {
  const customerRef = customerCollection().doc(customerId);
  const customerSnapshot = await customerRef.get();

  if (!customerSnapshot.exists) {
    return { error: "User Doesn't Exist" };
  }

  // Delete the customer
  await customerRef.delete();

  const deletedCustomer = { id: customerId, ...customerSnapshot.data() };
  delete deletedCustomer.password;

  return deletedCustomer;
};

// Get a customer by ID (excluding password)
CustomerService.getCustomerByIdAndExcludePassword = async (customerId) => {
  const customerRef = customerCollection().doc(customerId);
  const customerSnapshot = await customerRef.get();

  if (!customerSnapshot.exists) {
    return null;
  }

  const customer = { id: customerId, ...customerSnapshot.data() };
  delete customer.password;

  return customer;
};

// Get a customer by ID
CustomerService.getCustomerById = async (customerId) => {
  return CustomerService.getCustomerByIdAndExcludePassword(customerId);
};

// Fetch all customers
CustomerService.fetchAllCustomer = async () => {
  const customersSnapshot = await customerCollection().get();

  const customers = customersSnapshot.docs.map((doc) => {
    const customer = { id: doc.id, ...doc.data() };
    delete customer.password;
    return customer;
  });

  return customers;
};

CustomerService.currentCustomerUpdate = async (customerId, newCustomer) => {
  try {
    const customerRef = customerCollection().doc(customerId);
    const customerSnapshot = await customerRef.get();

    if (!customerSnapshot.exists) {
      return { error: "User Doesn't Exist" };
    }

    // Prepare the update data by removing undefined fields
    const updateData = removeUndefinedFields({
      fullName: newCustomer.fullName,
      companyName: newCustomer.companyName,
      rnc: newCustomer.rnc,
      whatsapp: newCustomer.whatsapp,
      country: newCustomer.country,
      countryCode: newCustomer.countryCode,
      address: newCustomer.address,
      port: newCustomer.port,
    });

    // Update the customer document
    await customerRef.update(updateData);

    // Fetch and return the updated document
    const updatedCustomerSnapshot = await customerRef.get();
    const updatedCustomer = { id: customerId, ...updatedCustomerSnapshot.data() };
    delete updatedCustomer.password; // Exclude sensitive fields

    return updatedCustomer;
  } catch (error) {
    console.error('Error updating customer:', error.message);
    throw new Error('Failed to update customer. Please try again.');
  }
};

const removeUndefinedFields = (data) => {
  return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));
};

module.exports = CustomerService;
