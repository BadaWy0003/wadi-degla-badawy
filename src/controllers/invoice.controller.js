const invoiceController = {};
const invoiceService = require("../services/invoice.service");

invoiceController.createInvoice = async (req, res) => {
  try {
    const data = await invoiceService.createInvoice(req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

invoiceController.getAllInvoices = async (req, res) => {
  try {
    const data = await invoiceService.getAllInvoices();

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

module.exports = invoiceController;
