const AuthService = {};
const { Prisma } = require("@prisma/client");
const prisma = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AUTH_TOKEN_EXPIRY = "7d";

AuthService.createCustomerAndGenerateToken = async (customerData) => {
  const { username, email, password } = customerData;
  const hashedPassword = await hashPassword(password);

  let token, newCustomer;

  const transaction = await prisma.$transaction(async (tx) => {
    newCustomer = await prisma.customer.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    try {
      token = await generateSignedUserToken(newCustomer.id);
    } catch (error) {
      throw new Error("Token generation failed");
    }

    return { newCustomer, token };
  });

  return transaction;
};

AuthService.loginUserAndSignToken = async (customerData) => {
  const { email, password } = customerData;
  let customer;

  try {
    customer = await prisma.customer.findUniqueOrThrow({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        console.log("authentication failed");
      }
    }
    throw err;
  }

  const isPasswordValid = await comparePassword(password, customer.password);

  if (!isPasswordValid) {
    console.log("Invalid Password");
    return isPasswordValid;
  }
  const token = await generateSignedUserToken(customer.id);

  return { customer, token };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, passwordDB) => {
  return bcrypt.compare(password, passwordDB);
};

const generateSignedUserToken = async (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRY,
  });
};

module.exports = AuthService;
