const prisma = require("../database");
const CustomerService = {};

CustomerService.getCustomer = async (customerId) => {
  return prisma.customer.findUnique({ where: { id: customerId } });
};

CustomerService.fetchAllCustomer = async () => {
  return prisma.customer.findMany();
};

module.exports = CustomerService;
