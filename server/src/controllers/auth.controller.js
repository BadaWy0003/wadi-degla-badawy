const AuthController = {};
const AuthService = require('../services/auth.service');

AuthController.customerRegister = async (req, res) => {
  const { fullName, companyName, rnc, email, phone, whatsapp, country, countryCode, address, port, password } = req.body;

  try {
    const data = await AuthService.createCustomerAndGenerateToken({
      fullName,
      companyName,
      rnc,
      email,
      phone,
      whatsapp,
      country,
      countryCode,
      address,
      port,
      password,
    });
    res.status(201).cookie('auth', data.token, { httpOnly: true }).json({
      id: data.newCustomer.id,
      fullName: data.newCustomer.fullName,
      companyName: data.newCustomer.companyName,
      rnc: data.newCustomer.rnc,
      email: data.newCustomer.email,
      phone: data.newCustomer.phone,
      whatsapp: data.newCustomer.whatsapp,
      country: data.newCustomer.country,
      countryCode: data.newCustomer.countryCode,
      address: data.newCustomer.address,
      port: data.newCustomer.port,
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
        fullName: data.customer.fullName,
        companyName: data.customer.companyName,
        rnc: data.customer.rnc,
        email: data.customer.email,
        phone: data.customer.phone,
        whatsapp: data.customer.whatsapp,
        country: data.customer.country,
        countryCode: data.customer.countryCode,
        address: data.customer.address,
        port: data.customer.port,
        token: data.token,
      });
  } catch (err) {
    console.log(err.message);

    res.status(401).send({ message: err.message });
  }
};

AuthController.customerCheckAuth = async (req, res) => {
  try {
    const data = await AuthService.customerCheckAuth(req.user);

    res.status(200).json({
      id: data._id,
      fullName: data.fullName,
      companyName: data.companyName,
      rnc: data.rnc,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      country: data.country,
      countryCode: data.countryCode,
      address: data.address,
      port: data.port,
    });
  } catch (err) {
    console.log(err.message);

    res.status(401).send({ message: err.message });
  }
};

AuthController.adminCheckAuth = async (req, res) => {
  try {
    const data = await AuthService.adminCheckAuth(req.user);

    res.status(200).json({
      id: data._id,
      fullName: data.fullName,
      companyName: data.companyName,
      rnc: data.rnc,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      country: data.country,
      countryCode: data.countryCode,
      address: data.address,
      port: data.port,
    });
  } catch (err) {
    console.log(err.message);

    res.status(401).send({ message: err.message });
  }
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
  res.status(200).clearCookie('auth', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.status(200).send('Logged out');
};

module.exports = AuthController;
