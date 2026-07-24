import { Prisma } from '@prisma/client';

import prisma from '../lib/prisma';
import { AppError } from '../middlewares/error-handler';

export const getCategories = () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getCategoryById = (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });
};

export const createCategory = async (name: string) => {
  try {
    return await prisma.category.create({
      data: { name },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError(409, 'CATEGORY_ALREADY_EXISTS', 'Category name already exists');
    }
    throw error;
  }
};

export const updateCategory = async (id: string, name: string) => {
  try {
    return await prisma.category.update({
      where: { id },
      data: { name },
      include: { products: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return null;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError(409, 'CATEGORY_ALREADY_EXISTS', 'Category name already exists');
    }

    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    return await prisma.category.delete({
      where: { id },
      include: { products: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return null;
    }
    throw error;
  }
};
