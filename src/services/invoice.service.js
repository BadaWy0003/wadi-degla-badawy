const invoiceService = {};
const prisma = require("../database");

invoiceService.requestInvoice = async (userId, requestData) => {
  const { customerData, itemsData } = requestData;

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  invoiceData = {
    invoiceNumber: "INV123456",
    status: 0,
    customerName: userData.username,
    customerEmail: userData.email,
    ...customerData,
    invoiceDate: new Date(),
  };

  const newInvoice = await prisma.invoice.create({
    data: {
      ...invoiceData,
      user: {
        connect: { id: userData.id },
      },
      items: {
        create: itemsData,
      },
    },
    include: {
      user: false,
      items: true,
    },
  });

  return newInvoice;
};

invoiceService.createInvoice = async (invoiceData) => {
  const { invoiceNumber, invoiceDate, invoiceAmount, userId } = invoiceData;

  const newInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newInvoice;
};

invoiceService.getAllInvoices = async () => {
  return prisma.invoice.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true,
          userType: true,
        },
      },
    },
  });
};

module.exports = invoiceService;
