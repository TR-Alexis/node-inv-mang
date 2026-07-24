import { Request, Response, NextFunction } from 'express';

import { ApiDataResponse } from '../types/api';
import { AppError } from '../middlewares/error-handler';
import * as categoryRepository from '../repositories/category.repository';
import {
  validateCreateCategoryPayload,
  validateUpdateCategoryPayload,
} from '../schemas/category.schema';

export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryRepository.getCategories();
    const payload: ApiDataResponse<typeof categories> = { data: categories };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await categoryRepository.getCategoryById(id);

    if (!category) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', `Category with id ${id} not found`);
    }

    const payload: ApiDataResponse<typeof category> = { data: category };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = validateCreateCategoryPayload(req.body);
    const category = await categoryRepository.createCategory(name);
    const payload: ApiDataResponse<typeof category> = { data: category };
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name } = validateUpdateCategoryPayload(req.body);
    const category = await categoryRepository.updateCategory(id, name);

    if (!category) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', `Category with id ${id} not found`);
    }

    const payload: ApiDataResponse<typeof category> = { data: category };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await categoryRepository.deleteCategory(id);

    if (!category) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', `Category with id ${id} not found`);
    }

    const payload: ApiDataResponse<typeof category> = { data: category };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};
