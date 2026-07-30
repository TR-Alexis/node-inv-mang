import { Request, Response, NextFunction } from 'express';

import { ApiDataResponse } from '../types/api';
import { AppError } from '../middlewares/error-handler';
import * as movementRepository from '../repositories/movement.repository';
import { validateCreateMovementPayload } from '../schemas/movement.schema';

export const createMovement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const movementData = validateCreateMovementPayload(req.body);
    const movement = await movementRepository.createMovement(id, movementData);

    const payload: ApiDataResponse<typeof movement> = { data: movement };
    res.status(201).json(payload);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(error);
  }
};

export const listMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const movements = await movementRepository.getMovementsByProductId(id);

    const payload: ApiDataResponse<typeof movements> = { data: movements };
    res.json(payload);
  } catch (error) {
    next(error);
  }
};
