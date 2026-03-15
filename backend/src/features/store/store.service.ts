import { Store, CreateStoreDTO, UpdateStoreDTO } from './store.types';
import Boom from '@hapi/boom';
import { pool } from '../../config/database';

export const getStoresService = async (): Promise<Store[]> => {
  const dbRequest = await pool.query(
    'SELECT id, name, info, address, status, owner_id as "ownerId" FROM stores'
  );
  return dbRequest.rows;
};

export const getStoreByIdService = async (storeId: number): Promise<Store> => {
  const dbRequest = await pool.query(
    'SELECT id, name, info, address, status, owner_id as "ownerId" FROM stores WHERE id = $1',
    [storeId]
  );

  if (dbRequest.rowCount === 0) {
    throw Boom.notFound('Store not found');
  }

  return dbRequest.rows[0];
};

export const createStoreService = async (
  store: CreateStoreDTO,
  ownerId: string
): Promise<Store> => {
  const dbRequest = await pool.query(
    `INSERT INTO stores (name, status, owner_id) 
     VALUES ($1, $2, $3) 
     RETURNING id, name, info, address, status, owner_id as "ownerId"`,
    [store.name, 'open', ownerId]
  );

  return dbRequest.rows[0];
};

export const updateStoreService = async (
  storeData: UpdateStoreDTO,
  storeId: number,
  ownerId: string
): Promise<Store> => {
  const currentStore = await getStoreByIdService(storeId);

  if (currentStore.ownerId !== ownerId) {
    throw Boom.forbidden('You are not the owner of this store');
  }

  const info = storeData.info ?? currentStore.info;
  const address = storeData.address ?? currentStore.address;
  const status = storeData.status ?? currentStore.status;

  const dbRequest = await pool.query(
    `UPDATE stores 
     SET info = $1, address = $2, status = $3 
     WHERE id = $4 
     RETURNING id, name, info, address, status, owner_id as "ownerId"`,
    [info, address, status, storeId]
  );

  return dbRequest.rows[0];
};

export const deleteStoreService = async (
  storeId: number,
  ownerId: string
): Promise<void> => {
  const store = await getStoreByIdService(storeId);

  if (store.ownerId !== ownerId) {
    throw Boom.forbidden('You are not the owner of this store');
  }

  await pool.query('DELETE FROM stores WHERE id = $1', [storeId]);
};
