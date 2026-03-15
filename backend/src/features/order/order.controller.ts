import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  createOrderService,
  deleteOrderService,
  getOrderByIdService,
  getOrdersService,
  updateOrderService,
} from './order.service';
import { getUserFromRequest } from '../../middlewares/authMiddleware';

export const getOrdersController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const orders = await getOrdersService(user.id, user.role as string);
  return res.json(orders);
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await getOrderByIdService(Number(id));
  return res.json(order);
};

export const createOrderController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);

  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { storeId, address, subtotal, total, Products } = req.body;

  if (storeId === undefined) {
    throw Boom.badRequest('StoreId is required');
  }
  if (subtotal === undefined) {
    throw Boom.badRequest('Subtotal is required');
  }

  if (total === undefined) {
    throw Boom.badRequest('Total is required');
  }

  if (address === undefined) {
    throw Boom.badRequest('Address is required');
  }

  if (Products === undefined || Products.length === undefined) {
    throw Boom.badRequest('At least one product is required');
  }

  const newOrder = await createOrderService(req.body, user.id);
  return res.status(201).json(newOrder);
};

export const updateOrderController = async (req: Request, res: Response) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { id } = req.params;
  const { status, deliveryId } = req.body;

  const updateOrder = await updateOrderService(
    {
      status,
      deliveryId,
    },
    Number(id)
  );
  return res.json(updateOrder);
};

export const deleteOrderController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const { id } = req.params;
  await deleteOrderService(Number(id), user.id);
  return res.send('Order deleted');
};
