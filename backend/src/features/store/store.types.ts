export enum StoreStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface Store {
  id: number;
  name: string;
  info?: string | null;
  address?: string | null;

  status: StoreStatus;

  ownerId: string;
}

export interface CreateStoreDTO {
  name: string;
}

export interface UpdateStoreDTO {
  info?: string;
  address?: string;
  status?: StoreStatus;
}
