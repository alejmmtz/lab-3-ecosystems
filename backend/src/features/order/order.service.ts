import { Order, CreateOrderDTO, UpdateOrderStatusDTO } from './order.types';
import Boom from '@hapi/boom';
import { pool } from '../../config/database';

export const getOrdersService = async (
  userId: string,
  role: string
): Promise<Order[]> => {
  let query =
    'SELECT id, status, subtotal, tip, total, address, indications, consumer_id as "consumerId", store_id as "storeId", delivery_id as "deliveryId", created_at as "createdAt" FROM orders';
  const params: string[] = [];

  if (role === 'consumer') {
    query += ' WHERE consumer_id = $1';
    params.push(userId);
  } else if (role === 'store') {
    query += ' WHERE store_id = $1';
    params.push(userId);
  } else if (role === 'delivery') {
    query += " WHERE delivery_id = $1 OR status = 'accepted'";
    params.push(userId);
  }

  const dbRequest = await pool.query(query, params);
  return dbRequest.rows;
};

export const getOrderByIdService = async (orderId: number): Promise<Order> => {
  const dbRequest = await pool.query(
    `SELECT id, status, subtotal, tip, total, address, indications, 
            consumer_id as "consumerId", store_id as "storeId", 
            delivery_id as "deliveryId", created_at as "createdAt" 
     FROM orders WHERE id = $1`,
    [orderId]
  );

  if (dbRequest.rowCount === 0) {
    throw Boom.notFound('Order not found');
  }

  const order = dbRequest.rows[0];

  const itemsRequest = await pool.query(
    'SELECT id, order_id as "orderId", product_id as "productId", quantity, unit_price as "unitPrice" FROM order_items WHERE order_id = $1',
    [orderId]
  );

  order.Products = itemsRequest.rows;
  return order;
};

export const createOrderService = async (
  order: CreateOrderDTO,
  consumerId: string
): Promise<Order> => {
  const dbRequest = await pool.query(
    `INSERT INTO orders (status, subtotal, tip, total, address, indications, consumer_id, store_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING id, status, subtotal, tip, total, address, indications, 
               consumer_id as "consumerId", store_id as "storeId", created_at as "createdAt"`,
    [
      'pending',
      order.subtotal,
      order.tip,
      order.total,
      order.address,
      order.indications,
      consumerId,
      order.storeId,
    ]
  );

  const finalOrder = dbRequest.rows[0];

  for (const products of order.Products) {
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
      [finalOrder.id, products.productId, products.quantity, products.unitPrice]
    );
  }

  finalOrder.Products = order.Products;

  return finalOrder;
};

export const updateOrderService = async (
  order: UpdateOrderStatusDTO,
  orderId: number
): Promise<Order> => {
  const orderFound = await getOrderByIdService(orderId);

  const status = order.status === undefined ? orderFound.status : order.status;
  const deliveryId =
    order.deliveryId === undefined ? orderFound.deliveryId : order.deliveryId;

  const dbRequest = await pool.query(
    `UPDATE orders SET status = $1, delivery_id = $2, updated_at = NOW() 
     WHERE id = $3 
     RETURNING id, status, subtotal, tip, total, address, indications, 
               consumer_id as "consumerId", store_id as "storeId", 
               delivery_id as "deliveryId", created_at as "createdAt"`,
    [status, deliveryId, orderId]
  );

  return dbRequest.rows[0];
};

export const deleteOrderService = async (
  orderId: number,
  consumerId: string
): Promise<void> => {
  const orderFound = await getOrderByIdService(orderId);

  if (orderFound.consumerId !== consumerId) {
    throw Boom.forbidden('You can only delete your own orders');
  }

  if (orderFound.status !== 'pending') {
    throw Boom.badRequest(
      'Cannot delete an order that has already been processed by the store'
    );
  }
  await pool.query('DELETE FROM order_items WHERE order_id = $1', [
    orderFound.id,
  ]);

  await pool.query('DELETE FROM orders WHERE id = $1', [orderFound.id]);
};
