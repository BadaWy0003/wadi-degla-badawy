const AuthService = require("../services/auth.service");
const AuthController = {};

AuthController.customerRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const data = await AuthService.createCustomerAndGenerateToken({
      username: username,
      email: email,
      password: password,
    });

    res.status(201).cookie("auth", data.token, { httpOnly: true }).json({
      id: data.newCustomer.id,
      username: data.newCustomer.username,
      email: data.newCustomer.email,
      token: data.token,
    });
  } catch (err) {
    
    res.status(401).send({ message: err.message });
  }
};

AuthController.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginCustomerAndSignToken({
      email,
      password,
    });

    res.status(200).cookie("auth", data.token, { httpOnly: true }).json({
      id: data.customer.id,
      email: data.customer.email,
      token: data.token,
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

AuthController.deleteCookie = async (req, res) => {
  res.status(200).clearCookie("auth").send("user logged out");
};

module.exports = AuthController;
