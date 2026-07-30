import { Router } from 'express';

import { ApiDataResponse } from '../types/api';
import { authMiddleware, requireRole } from '../middlewares/auth';
import authRouter from './auth';
import categoriesRouter from './categories';
import productsRouter from './products';

const router = Router();

router.get('/', (_request, response) => {
  const payload: ApiDataResponse<{
    name: string;
    version: string;
    status: string;
  }> = {
    data: {
      name: 'Inventory API',
      version: 'v1',
      status: 'ok',
    },
  };

  response.json(payload);
});

router.use('/auth', authRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.get('/admin', authMiddleware, requireRole('ADMIN'), (_req, res) => {
  res.json({ data: { message: 'Admin access granted' } });
});

export default router;
