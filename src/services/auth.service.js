const AuthService = {};
const prisma = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AUTH_TOKEN_EXPIRY = "7d";

AuthService.createUserAndGenerateToken = async (userData) => {
  const { username, email, password, userType } = userData;

  const userExist = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (userExist) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  let token, newUser;

  const transaction = await prisma.$transaction(async (tx) => {
    newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType,
      },
    });

    try {
      token = await generateSignedUserToken(newUser.id, newUser.userType);
    } catch (error) {
      throw new Error("Token generation failed");
    }

    return { newUser, token };
  });

  return transaction;
};

AuthService.loginUserAndSignToken = async (userData) => {
  const { email, password } = userData;
  let user;

  user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = await generateSignedUserToken(user.id);

  return { user, token };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, passwordDB) => {
  return bcrypt.compare(password, passwordDB);
};

const generateSignedUserToken = async (id, userType) => {
  return jwt.sign({ id, userType }, process.env.SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRY,
  });
};

module.exports = AuthService;
