import { Router } from 'express';
import {
  createOrderController,
  deleteOrderController,
  getOrderByIdController,
  getOrdersController,
  updateOrderController,
} from './order.controller';
import { authMiddleware, checkRole } from '../../middlewares/authMiddleware';

export const router = Router();

router.use(authMiddleware);

router.get('/', getOrdersController);
router.get('/:id', getOrderByIdController);

router.post('/', checkRole(['consumer']), createOrderController);

router.patch('/:id', checkRole(['store', 'delivery']), updateOrderController);
router.delete('/:id', checkRole(['consumer']), deleteOrderController);
