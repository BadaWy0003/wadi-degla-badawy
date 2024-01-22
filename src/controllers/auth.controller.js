const AuthService = require("../services/auth.service");
const AuthController = {};

AuthController.userRegister = async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    const data = await AuthService.createUserAndGenerateToken({
      username: username,
      email: email,
      password: password,
      userType: userType,
    });

    res.status(201).cookie("auth", data.token, { httpOnly: true }).json({
      id: data.newUser.id,
      username: data.newUser.username,
      email: data.newUser.email,
      userType: data.newUser.userType,
      token: data.token,
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

AuthController.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginUserAndSignToken({
      email,
      password,
    });

    res.status(200).cookie("auth", data.token, { httpOnly: true }).json({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      userType: data.user.userType,
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
