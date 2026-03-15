import Boom from '@hapi/boom';
import { pool } from '../../config/database';
import { CreateProductDTO, Product, UpdateProductDTO } from './product.types';

export const getProductsService = async (
  storeId?: string
): Promise<Product[]> => {
  let query =
    'SELECT id, name, price, description, store_id as "storeId" FROM products';
  const params: string[] = [];

  if (storeId) {
    query += ' WHERE store_id = $1';
    params.push(storeId);
  }

  const dbRequest = await pool.query(query, params);
  return dbRequest.rows;
};

export const getProductByIdService = async (
  productId: number
): Promise<Product> => {
  const dbRequest = await pool.query(
    'SELECT id, name, price, description, store_id as "storeId" FROM products WHERE id = $1',
    [productId]
  );

  if (dbRequest.rowCount === 0) {
    throw Boom.notFound('Product not found');
  }

  return dbRequest.rows[0];
};

export const createProductService = async (
  product: CreateProductDTO
): Promise<Product> => {
  const dbRequest = await pool.query(
    `INSERT INTO products (name, price, description, store_id) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, price, description, store_id as "storeId"`,
    [product.name, product.price, product.description, product.storeId]
  );

  return dbRequest.rows[0];
};

export const updateProductService = async (
  product: UpdateProductDTO,
  productId: number
): Promise<Product> => {
  const currentProduct = await getProductByIdService(productId);

  const price =
    product.price === undefined ? currentProduct.price : product.price;
  const description =
    product.description === undefined
      ? currentProduct.description
      : product.description;

  const dbRequest = await pool.query(
    `UPDATE products 
     SET price = $1, description = $2 
     WHERE id = $3 
     RETURNING id, name, price, description, store_id as "storeId"`,
    [price, description, productId]
  );

  return dbRequest.rows[0];
};

export const deleteProductService = async (
  productId: number,
  storeId: string
): Promise<void> => {
  const product = await getProductByIdService(productId);

  if (product.storeId !== storeId) {
    throw Boom.forbidden(
      'You do not have this product in your store, action denied'
    );
  }

  await pool.query('DELETE FROM products WHERE id = $1', [productId]);
};
