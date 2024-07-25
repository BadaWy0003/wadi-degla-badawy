const UserService = {};
const prisma = require('../database');
const hashPassword = require('../utils/password-hasher');

UserService.createUser = async (userData) => {
  const { username, email, password, userType } = userData;

  const userExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userExist) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      userType,
    },
  });
  delete newUser.password;

  return { newUser };
};

UserService.deleteUser = async (userId) => {
  const parsedUserId = parseInt(userId, 10);

  const userExist = await prisma.user.findUnique({
    where: { id: parsedUserId },
  });

  if (!userExist) {
    return { error: "User Doesn't Exist" };
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return deletedUser;
};

UserService.getUserByIdAndExcludePassword = async (userId) => {
  const parsedUserId = parseInt(userId, 10);

  return prisma.user.findUnique({
    where: { id: parsedUserId },
    select: {
      id: true,
      username: true,
      email: true,
      userType: true,
      password: false,
    },
  });
};

UserService.getUserById = async (userId) => {
  const parsedUserId = parseInt(userId, 10);

  return prisma.user.findUnique({
    where: { id: parsedUserId },
  });
};

UserService.fetchAllUser = async () => {
  const respond = await prisma.user.findMany();
  return respond;
};

UserService.currentUserUpdate = async (userId, newUser) => {
  const userExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExist) {
    return { error: "User Doesn't Exist" };
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUser.username,
    },
  });

  return updatedUser;
};

module.exports = UserService;
