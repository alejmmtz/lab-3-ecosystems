export interface Product {
  id: number;

  name: string;
  price: number;
  description: string;

  storeId: string;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  description: string;

  storeId: string;
}

export interface UpdateProductDTO {
  price?: number;
  description?: string;
}
