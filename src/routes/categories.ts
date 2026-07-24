import { Router } from 'express';

import {
  addCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '../controllers/category.controller';

const router = Router();

router.get('/', listCategories);
router.post('/', addCategory);
router.get('/:id', getCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
