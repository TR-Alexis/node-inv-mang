import { Request, Response, NextFunction } from 'express';

import { ApiDataResponse } from '../types/api';
import { AppError } from '../middlewares/error-handler';
import * as productRepository from '../repositories/product.repository';
import {
  validateCreateProductPayload,
  validateProductQueryParams,
  validateUpdateProductPayload,
} from '../schemas/product.schema';

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = validateProductQueryParams(req.query);
    const { data, total } = await productRepository.getProducts(query);

    const payload: ApiDataResponse<typeof data> = { data };
    res.json({ ...payload, meta: { page: query.page, limit: query.limit, total } });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productRepository.getProductById(id);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product with id ${id} not found`);
    }

    const payload: ApiDataResponse<typeof product> = { data: product };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = validateCreateProductPayload(req.body);
    const product = await productRepository.createProduct(productData);
    const payload: ApiDataResponse<typeof product> = { data: product };
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updateData = validateUpdateProductPayload(req.body);
    const product = await productRepository.updateProduct(id, updateData);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product with id ${id} not found`);
    }

    const payload: ApiDataResponse<typeof product> = { data: product };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productRepository.deleteProduct(id);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', `Product with id ${id} not found`);
    }

    const payload: ApiDataResponse<typeof product> = { data: product };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};
