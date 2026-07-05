export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock?: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar?: string;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};
