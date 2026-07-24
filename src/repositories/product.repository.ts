import { Prisma, Product } from '@prisma/client';

import prisma from '../lib/prisma';

export const getProducts = async (params: {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}) => {
  const where: Prisma.ProductWhereInput = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { sku: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { data, total };
};

export const getProductById = (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
};

export const createProduct = (data: {
  name: string;
  sku: string;
  description?: string;
  quantity?: number;
  categoryId?: string;
}) => {
  return prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description,
      quantity: data.quantity,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
};

export const updateProduct = (id: string, data: {
  name?: string;
  sku?: string;
  description?: string;
  quantity?: number;
  categoryId?: string;
}) => {
  return prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });
};

export const deleteProduct = (id: string) => {
  return prisma.product.delete({
    where: { id },
    include: { category: true },
  });
};
