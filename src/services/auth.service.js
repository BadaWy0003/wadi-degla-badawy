const AuthService = {};
const prisma = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AUTH_TOKEN_EXPIRY = "7d";

AuthService.createCustomerAndGenerateToken = async (userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await hashPassword(password);

  let token, newUser;

  const transaction = await prisma.$transaction(async (tx) => {
    newUser = await prisma.customer.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    try {
      token = await generateSignedUserToken(newUser.id);
    } catch (error) {
      throw new Error("Token generation failed");
    }

    return { newUser, token };
  });

  return transaction;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const generateSignedUserToken = async (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRY,
  });
};

module.exports = AuthService;
