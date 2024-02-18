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
    invoiceNumber: generateInvoiceId(),
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

invoiceService.offer = async (offerData) => {
  const { invoiceId, itemUpdates } = offerData;

  for (const update of itemUpdates) {
    await prisma.invoiceItem.update({
      where: {
        id: update.itemId,
      },
      data: {
        price: update.newPrice,
      },
    });
  }

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: 1,
    },
  });

  return updatedInvoice;
};

invoiceService.acceptOffer = async (offerData) => {
  const { invoiceId } = offerData;

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: 3,
    },
  });

  return updatedInvoice;
};

invoiceService.getMyInvoices = async (userId) => {
  return prisma.invoice.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });
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

function generateInvoiceId() {
  const date = new Date();
  const prefix = "INV";
  const timestamp = date
    .toISOString()
    .replace(/[^0-9]/g, "")
    .substring(0, 14);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${randomPart}`;
}

module.exports = invoiceService;
