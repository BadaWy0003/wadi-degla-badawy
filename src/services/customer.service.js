const prisma = require("../database");
const CustomerService = {};

CustomerService.getCustomerById = async (customerId) => {
  customerId = parseInt(customerId);

  return prisma.customer.findUnique({ where: { id: customerId } });
};

CustomerService.fetchAllCustomer = async () => {

  return prisma.customer.findMany();
};

CustomerService.currentCustomerUpdate = async (customerId, newCustomer) => {
  const customerExist = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customerExist) {
    return { error: "Customer Doesn't Exist" };
  }

  const updatedCustomer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      username: newCustomer.username,
    },
  });

  return updatedCustomer;
};

module.exports = CustomerService;
