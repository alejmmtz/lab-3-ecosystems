export enum UserRole {
  STORE = 'store',
  CONSUMER = 'consumer',
  DELIVERY = 'delivery',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  password: string;
}

export interface CreateUserDTO {
  email: string;
  role: UserRole;
  name: string;
  password: string;

  storeName?: string;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}
