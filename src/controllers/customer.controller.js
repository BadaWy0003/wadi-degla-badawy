const CustomerService = require("../services/customer.service");
const CustomerController = {};

CustomerController.getCurrentCustomerProfile = async (req, res) => {
  try {
    const data = await CustomerService.getCustomer(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: err.message });
  }
};

module.exports = CustomerController;
