import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prisma';
import { AppError } from '../middlewares/error-handler';

export const registerUser = async (email: string, password: string, name?: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'VIEWER',
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError(409, 'USER_ALREADY_EXISTS', 'A user with that email already exists');
    }

    throw error;
  }
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
