const generateInvoiceId = async () => {
  const date = new Date();
  const prefix = 'INV';
  const timestamp = date
    .toISOString()
    .replace(/[^0-9]/g, '')
    .substring(0, 14);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${randomPart}`;
};

module.exports = generateInvoiceId;
