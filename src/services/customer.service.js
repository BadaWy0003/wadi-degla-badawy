const prisma = require("../database");
const CustomerService = {};

CustomerService.getCustomer = async (customerId) => {
  return prisma.customer.findUnique({ where: { id: customerId } });
};

module.exports = CustomerService;
