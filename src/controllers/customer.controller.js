const CustomerService = require("../services/customer.service");
const CustomerController = {};

CustomerController.getCurrentCustomer = async (req, res) => {
  try {
    const data = await CustomerService.getCustomerById(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.getAllCustomer = async (req, res) => {
  try {
    const data = await CustomerService.fetchAllCustomer();

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.getCustomerById = async (req, res) => {
  try {
    const data = await CustomerService.getCustomerById(req.params.customerId);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = CustomerController;
