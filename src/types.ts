export type UserRole = 'farmer' | 'consumer' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  github_username?: string;
  created_at: string;
}

export interface FarmerProfile {
  id: number;
  user_id: number;
  farm_name: string;
  farm_location: string;
  state: string;
  total_acres: number;
  organic_certified: boolean;
  upi_id: string;
  rating: number;
  total_sales_kg: number;
  bio: string;
  phone: string;
}

export type CropCategory = 'Vegetables' | 'Grains' | 'Fruits' | 'Pulses' | 'Spices';

export interface Crop {
  id: number;
  farmer_id: number;
  farmer_name: string;
  farm_name: string;
  location: string;
  crop_name: string;
  category: CropCategory;
  variety: string;
  price_per_kg: number;
  stock_quantity_kg: number;
  harvest_date: string;
  shelf_life_days: number;
  organic_certified: boolean;
  image_url: string;
  description: string;
  min_order_kg: number;
  status: 'available' | 'low_stock' | 'sold_out';
}

export type OrderStatus = 'pending' | 'confirmed' | 'harvested' | 'in_transit' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'escrow_held' | 'released' | 'refunded';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface TrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  crop_id: number;
  crop_name: string;
  quantity_kg: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  consumer_id: number;
  consumer_name: string;
  farmer_id: number;
  farmer_name: string;
  total_amount: number;
  delivery_fee: number;
  platform_fee: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  shipping_address: string;
  order_date: string;
  estimated_delivery: string;
  items: OrderItem[];
  tracking_steps: TrackingStep[];
  has_reviewed?: boolean;
}

export interface PaymentRecord {
  id: number;
  order_id: number;
  transaction_ref: string;
  amount: number;
  method: PaymentMethod;
  status: 'successful' | 'escrow_held' | 'released' | 'failed';
  escrow_released: boolean;
  timestamp: string;
}

export interface MarketPrice {
  id: number;
  crop_name: string;
  category: CropCategory;
  modal_price: number; // wholesale benchmark ₹/kg
  min_price: number;
  max_price: number;
  trend: 'up' | 'down' | 'stable';
  mandi_name: string;
  state: string;
  updated_at: string;
}

export interface CropInquiry {
  id: number;
  crop_id: number;
  crop_name: string;
  farmer_id: number;
  consumer_id: number;
  consumer_name: string;
  consumer_phone: string;
  offered_price_per_kg: number;
  quantity_kg: number;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface Review {
  id: number;
  farmer_id: number;
  farmer_name: string;
  consumer_id: number;
  consumer_name: string;
  order_id?: number;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface CartItem {
  crop: Crop;
  quantity_kg: number;
}

export interface TableColumnSchema {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  description: string;
}

export interface TableSchema {
  tableName: string;
  description: string;
  columns: TableColumnSchema[];
}
