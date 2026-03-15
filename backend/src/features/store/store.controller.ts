import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  createStoreService,
  deleteStoreService,
  getStoreByIdService,
  getStoresService,
  updateStoreService,
} from './store.service';
import { getUserFromRequest } from '../../middlewares/authMiddleware';

export const getStoresController = async (req: Request, res: Response) => {
  const stores = await getStoresService();
  return res.json(stores);
};

export const getStoreByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const store = await getStoreByIdService(Number(id));
  return res.json(store);
};

export const createStoreController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const { name } = req.body;

  if (!name) throw Boom.badRequest('Store name is required');

  const newStore = await createStoreService({ name }, user.id);
  return res.status(201).json(newStore);
};

export const updateStoreController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const { id } = req.params;

  const updatedStore = await updateStoreService(req.body, Number(id), user.id);
  return res.json(updatedStore);
};

export const deleteStoreController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const { id } = req.params;

  await deleteStoreService(Number(id), user.id);
  return res.send('Store deleted');
};
