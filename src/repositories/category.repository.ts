import prisma from '../lib/prisma';

export const getCategories = () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
};

export const createCategory = (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};
