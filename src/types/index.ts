export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  image_urls: string[];
  stock: number;
  emi_available: boolean | null;
  emi_months: number[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  seller_id: string;
  status: string;
  total_amount: number;
  discount_amount: number | null;
  final_amount: number;
  shipping_address_id: string;
  payment_method: string;
  payment_status: string;
  emi_selected: boolean | null;
  emi_months: number | null;
  emi_monthly_amount: number | null;
  created_at: string;
  updated_at: string;
  shipping_address?: Address;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  discount_price: number | null;
  total_price: number;
  created_at: string;
  product?: Product;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  created_at: string;
}
