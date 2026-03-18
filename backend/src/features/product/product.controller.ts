import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from './product.service';
import { getUserFromRequest } from '../../middlewares/authMiddleware';
import { getStoreByOwnerIdService } from '../store/store.service';

export const getProductsController = async (req: Request, res: Response) => {
  const { storeId } = req.query;
  const products = await getProductsService(storeId as string);
  return res.json(products);
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByIdService(Number(id));
  return res.json(product);
};

export const createProductController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);

  const store = await getStoreByOwnerIdService(user.id);

  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { name, price, description } = req.body;

  if (!name) throw Boom.badRequest('Name is required');
  if (price === undefined) throw Boom.badRequest('Price is required');
  if (!description) throw Boom.badRequest('Description is required');

  const newProduct = await createProductService({
    name,
    price,
    description,
    storeId: store.id.toString(),
  });

  return res.status(201).json(newProduct);
};

export const updateProductController = async (req: Request, res: Response) => {
  if (!req.body) {
    throw Boom.badRequest('Request body is required');
  }

  const { id } = req.params;
  const { price, description } = req.body;

  const updatedProduct = await updateProductService(
    { price, description },
    Number(id)
  );

  return res.json(updatedProduct);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const user = getUserFromRequest(req);
  const { id } = req.params;

  const store = await getStoreByOwnerIdService(user.id);
  await deleteProductService(Number(id), store.id.toString());

  return res.send('Product deleted');
};
