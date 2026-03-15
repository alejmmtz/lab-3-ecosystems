export enum OrderStatus {
  //on hold initial state
  PENDING = 'pending',

  //uptaded by stores
  ACCEPTED = 'accepted',
  DECLINED = 'declined',

  //uptaded by delivery guys
  PICKED = 'picked',
  DELIVERED = 'delivered',
}

export interface OrderProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;

  status: OrderStatus;

  subtotal: number;
  tip: number;
  total: number;

  address: string;
  indications?: string | null;

  createdAt: Date;
  updatedAt: Date;

  consumerId: string;
  storeId: number;
  deliveryId?: string | null;

  Products?: OrderProduct[];
}

export interface CreateOrderDTO {
  storeId: number;
  address: string;
  indications?: string;

  tip?: number;
  subtotal: number;
  total: number;

  Products: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  deliveryId?: string;
}
