import { prisma } from "../prisma";

const createUser = async (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return prisma.user.create({
    data,
  });
};

const getUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const checkEmailAvailability = async (email: string) => {
  const user = await getUserByEmail(email);

  return !user;
};

const userService = {
  createUser,
  getUserByEmail,
  getUserById,
  checkEmailAvailability,
};

export { userService };
