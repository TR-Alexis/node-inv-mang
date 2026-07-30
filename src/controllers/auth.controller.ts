import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ApiDataResponse } from '../types/api';
import { AppError } from '../middlewares/error-handler';
import * as authRepository from '../repositories/auth.repository';
import { validateLoginPayload, validateRegisterPayload } from '../schemas/auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '8h';

const buildToken = (user: { id: string; email: string; role: string }) => {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = validateRegisterPayload(req.body);
    const user = await authRepository.registerUser(payload.email, payload.password, payload.name);

    const token = buildToken({ id: user.id, email: user.email, role: user.role });
    const responsePayload: ApiDataResponse<{ token: string; user: typeof user }> = {
      data: { token, user },
    };

    res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = validateLoginPayload(req.body);
    const user = await authRepository.findUserByEmail(payload.email);

    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isValidPassword = await authRepository.verifyPassword(payload.password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const token = buildToken({ id: user.id, email: user.email, role: user.role });
    const responsePayload: ApiDataResponse<{ token: string; user: typeof user }> = {
      data: { token, user },
    };

    res.json(responsePayload);
  } catch (error) {
    next(error);
  }
};
