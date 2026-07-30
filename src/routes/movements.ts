import { Router } from 'express';

import { createMovement, listMovements } from '../controllers/movement.controller';

const router = Router({ mergeParams: true });

router.get('/', listMovements);
router.post('/', createMovement);

export default router;
