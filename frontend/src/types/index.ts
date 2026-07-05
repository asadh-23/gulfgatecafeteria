// Unified MenuItem type — works with both static data and API data
export interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  short_description?: string;
  description?: string;
  ingredients?: string;
  full_description?: string;
  price: number;
  category: string;
  image: string;
  gallery?: string[];
  isPopular?: boolean;
  isSpicy?: boolean;
  stock?: number;
  isActive?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
