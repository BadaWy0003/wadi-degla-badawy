const prisma = require("../database");
const UserService = {};

UserService.getUserByIdAndExcludePassword = async (userId) => {
  userId = parseInt(userId);

  return prisma.user.findUnique({
    where: { id: userId },
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
  userId = parseInt(userId);

  return prisma.user.findUnique({
    where: { id: userId },
  });
};

UserService.fetchAllUser = async () => {
  return prisma.user.findMany();
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
