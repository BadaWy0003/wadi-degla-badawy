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
      id: data.newUser.id,
      username: data.newUser.username,
      email: data.newUser.email,
      token: data.token,
    });
  } catch (err) {
    console.log(err.message);
    throw new Error("Failed to Register customer");
  }
};

AuthController.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginUserAndSignToken({
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
