const AuthController = {};
const AuthService = require('../services/auth.service');

AuthController.customerRegister = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const data = await AuthService.createCustomerAndGenerateToken({
      username,
      email,
      phone,
      password,
    });

    res.status(201).cookie('auth', data.token, { httpOnly: true }).json({
      id: data.newCustomer.id,
      username: data.newCustomer.username,
      email: data.newCustomer.email,
      phone: data.newCustomer.phone,
      token: data.token,
    });
  } catch (err) {
     const statusCode = err.statusCode || 400; // Default to 400 if no statusCode is set
     res.status(statusCode).send({ message: err.message });
  }
};

AuthController.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginCustomerAndSignToken({
      email,
      password,
    });

    res
      .status(200)
      .cookie('auth', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        id: data.customer.id,
        username: data.customer.username,
        email: data.customer.email,
      });
  } catch (err) {
    console.log(err.message);
    
    res.status(401).send({ message: err.message });
  }
};

AuthController.customerCheckAuth = async (req, res) => {
  res.status(200).json({ user: req.user });
};

AuthController.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginAdminAndSignToken({
      email,
      password,
    });

    res.status(200).cookie('auth', data.token, { httpOnly: true }).json({
      id: data.admin.id,
      username: data.admin.username,
      email: data.admin.email,
      token: data.token,
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

AuthController.deleteCookie = async (req, res) => {
  res.status(200).clearCookie('auth').send('user logged out');
};

module.exports = AuthController;
