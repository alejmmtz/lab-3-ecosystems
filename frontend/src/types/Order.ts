export interface Order {
  id: number;
  status: "pending" | "accepted" | "declined" | "picked" | "delivered";
  subtotal: number;
  tip: number;
  total: number;
  address: string;
  indications?: string | null;
  consumerId: string;
  storeId: number;
  deliveryId?: string | null;
  createdAt: string;
}
