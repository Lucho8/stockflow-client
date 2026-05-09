export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  createdAt: string;
  categoryId: number;
  category: Category;
  supplierId: number;
  supplier: Supplier;
}

export interface StockMovement {
  id: number;
  type: string;
  quantity: number;
  notes: string;
  createdAt: string;
  productId: number;
  product: Product;
  userId: number;
  user: User;
}
