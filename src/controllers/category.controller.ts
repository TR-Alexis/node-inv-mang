import { Request, Response, NextFunction } from 'express';

import { ApiDataResponse } from '../types/api';
import * as categoryRepository from '../repositories/category.repository';

export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryRepository.getCategories();
    const payload: ApiDataResponse<typeof categories> = { data: categories };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const category = await categoryRepository.createCategory(name);
    const payload: ApiDataResponse<typeof category> = { data: category };
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};
