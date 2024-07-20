const OrderController = {};
const OrderService = require('../services/order.service');

OrderController.requestInvoice = async (req, res) => {
  try {
    const data = await OrderService.requestInvoice(req.user.id, req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

OrderController.offerPrice = async (req, res) => {
  try {
    const data = await OrderService.offerPrice(req.body);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

OrderController.acceptOffer = async (req, res) => {
  try {
    const data = await OrderService.acceptOffer(req.body);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

OrderController.approveOrder = async (req, res) => {
  try {
    const data = await OrderService.approveOrder(req.body);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

OrderController.getMyInvoices = async (req, res) => {
  try {
    const data = await OrderService.getMyInvoices(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

OrderController.createInvoice = async (req, res) => {
  try {
    const data = await OrderService.createInvoice(req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

OrderController.getAllInvoices = async (req, res) => {
  try {
    const data = await OrderService.getAllInvoices();

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
};

module.exports = OrderController;
