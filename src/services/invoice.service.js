const invoiceService = {};
const prisma = require("../database");

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
