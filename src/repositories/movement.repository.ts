import { Prisma } from '@prisma/client';

import prisma from '../lib/prisma';
import { AppError } from '../middlewares/error-handler';

export const createMovement = async (
  productId: string,
  data: { type: 'IN' | 'OUT' | 'ADJUSTMENT'; quantity: number; note?: string },
) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    let nextQuantity = product.quantity;
    if (data.type === 'IN') {
      nextQuantity += data.quantity;
    } else if (data.type === 'OUT') {
      if (product.quantity < data.quantity) {
        throw new AppError(400, 'INSUFFICIENT_STOCK', 'Insufficient stock for this operation');
      }
      nextQuantity -= data.quantity;
    } else if (data.type === 'ADJUSTMENT') {
      nextQuantity = data.quantity;
    }

    const movement = await tx.stockMovement.create({
      data: {
        type: data.type,
        quantity: data.quantity,
        note: data.note,
        productId,
        userId: null,
      },
    });

    await tx.product.update({
      where: { id: productId },
      data: { quantity: nextQuantity },
    });

    return movement;
  });
};

export const getMovementsByProductId = (productId: string) => {
  return prisma.stockMovement.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    include: { product: true },
  });
};
