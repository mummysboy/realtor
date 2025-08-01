export interface Listing {
  id: string;
  title: string;
  description: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  images: string[];
  availableTimes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ViewingRequest {
  id: string;
  listingId: string;
  phone: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  images: string[];
  availableTimes: string[];
}

export interface CreateViewingRequestRequest {
  listingId: string;
  phone: string;
  timeSlot: string;
} 