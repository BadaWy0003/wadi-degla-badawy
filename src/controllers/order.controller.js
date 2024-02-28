const invoiceController = {};
const invoiceService = require('../services/order.service');

invoiceController.requestInvoice = async (req, res) => {
  try {
    const data = await invoiceService.requestInvoice(req.user.id, req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

invoiceController.offer = async (req, res) => {
  try {
    const data = await invoiceService.offer(req.body);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

invoiceController.acceptOffer = async (req, res) => {
  try {
    const data = await invoiceService.acceptOffer(req.body);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

invoiceController.approveOffer = async (req, res) => {
  try {
    const data = await invoiceService.approveOffer(req.body);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

invoiceController.getMyInvoices = async (req, res) => {
  try {
    const data = await invoiceService.getMyInvoices(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

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
