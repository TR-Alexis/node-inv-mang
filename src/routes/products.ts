import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product.controller';
import movementsRouter from './movements';

const router = Router();

router.use('/:id/movements', movementsRouter);
router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
