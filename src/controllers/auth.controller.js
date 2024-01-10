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
    throw new Error("Failed to create customer");
  }
};

module.exports = AuthController;
