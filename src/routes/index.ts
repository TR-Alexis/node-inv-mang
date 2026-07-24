import { Router } from 'express';

import { ApiDataResponse } from '../types/api';
import categoriesRouter from './categories';

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

router.use('/categories', categoriesRouter);

export default router;
