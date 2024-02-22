const invoiceService = {};
const prisma = require('../database');
const generateInvoiceId = require('../utils/generate-invoice');

invoiceService.requestInvoice = async (userId, requestData) => {
  const { customerData, itemsData } = requestData;

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const invoiceData = {
    invoiceNumber: await generateInvoiceId(),
    status: 0,
    customerId: userData.id.toString(),
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

invoiceService.offerPrice = async (offerData) => {
  const { invoiceId, priceOffered } = offerData;

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: 1,
      priceOffered,
    },
  });

  return updatedInvoice;
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
  const respond = prisma.invoice.findMany({
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
  return respond;
};

module.exports = invoiceService;
