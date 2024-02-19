const AuthService = {};
const prisma = require('../database');
const hashPassword = require('../utils/password-hasher');
const comparePassword = require('../utils/compare-password');
const generateSignedUserToken = require('../utils/generate-token');

AuthService.createUserAndGenerateToken = async (userData) => {
  const { username, email, password } = userData;

  const userExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userExist) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  let token;
  let newUser;

  const transaction = await prisma.$transaction(async () => {
    newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: 'CUSTOMER',
      },
    });

    try {
      token = await generateSignedUserToken(newUser.id, newUser.userType);
    } catch (error) {
      throw new Error('Token generation failed');
    }

    return { newUser, token };
  });

  return transaction;
};

AuthService.loginUserAndSignToken = async (userData) => {
  const { email, password } = userData;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = await generateSignedUserToken(user.id);

  return { user, token };
};

module.exports = AuthService;
