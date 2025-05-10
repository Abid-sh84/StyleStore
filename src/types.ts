export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  relatedProducts: number[];
 
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface SortOption {
  label: string;
  value: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc';
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ShareOption {
  platform: string;
  icon: string;
  shareUrl: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  birthdate?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  addresses?: Address[];
  preferences: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy?: {
      shareProfileData: boolean;
      allowMarketingCommunication: boolean;
    };
  };
}