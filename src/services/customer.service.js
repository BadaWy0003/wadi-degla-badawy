const prisma = require("../database");
const CustomerService = {};

CustomerService.getCustomerById = async (customerId) => {
  customerId = parseInt(customerId);

  return prisma.customer.findUnique({ where: { id: customerId } });
};

CustomerService.fetchAllCustomer = async () => {
  return prisma.customer.findMany();
};


module.exports = CustomerService;
