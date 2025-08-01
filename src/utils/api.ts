import { Listing, ViewingRequest, CreateListingRequest, CreateViewingRequestRequest } from '../types';

// Replace with your actual API Gateway endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/prod';

// Mock data for local development
const mockListings: Listing[] = [
  {
    id: 'listing-001',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown. Features include hardwood floors, stainless steel appliances, and a private balcony with city views. Walking distance to restaurants, shopping, and public transportation.',
    rent: 2200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1560448204-5f9c0b0b0b0b?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'listing-002',
    title: 'Cozy Suburban House',
    description: 'Charming 3-bedroom house in a quiet suburban neighborhood. Features a large backyard, updated kitchen, and finished basement. Perfect for families looking for space and comfort.',
    rent: 2800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc8?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'listing-003',
    title: 'Luxury High-Rise Condo',
    description: 'Stunning 1-bedroom condo in a luxury high-rise building. Features floor-to-ceiling windows, modern amenities, fitness center, and rooftop pool. Ideal for professionals seeking a premium lifestyle.',
    rent: 3500,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    address: '789 Park Avenue',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1560448204-5f9c0b0b0b0b?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'listing-004',
    title: 'Historic Townhouse',
    description: 'Beautifully restored 4-bedroom townhouse with original architectural details. Features include exposed brick walls, high ceilings, and a private garden. Located in a historic district with easy access to downtown.',
    rent: 4200,
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 1800,
    address: '321 Elm Street',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc8?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'listing-005',
    title: 'Studio Loft',
    description: 'Modern studio loft with open floor plan and industrial design. Features high ceilings, large windows, and built-in storage. Perfect for young professionals or students.',
    rent: 1500,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 500,
    address: '654 Pine Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1560448204-5f9c0b0b0b0b?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const api = {
  // Listings
  async getListings(): Promise<Listing[]> {
    // For local development, return mock data
    if (!process.env.REACT_APP_API_URL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockListings), 500); // Simulate network delay
      });
    }

    const response = await fetch(`${API_BASE_URL}/listings`);
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    return response.json();
  },

  async getListingById(id: string): Promise<Listing> {
    // For local development, return mock data
    if (!process.env.REACT_APP_API_URL) {
      const listing = mockListings.find(l => l.id === id);
      if (!listing) {
        throw new Error('Listing not found');
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(listing), 500); // Simulate network delay
      });
    }

    const response = await fetch(`${API_BASE_URL}/listings/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }
    return response.json();
  },

  async createListing(data: CreateListingRequest): Promise<Listing> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('rent', data.rent.toString());
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('sqft', data.sqft.toString());
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zipCode', data.zipCode);
    formData.append('availableTimes', JSON.stringify(data.availableTimes));
    
    data.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to create listing');
    }
    return response.json();
  },

  // Viewing Requests
  async createViewingRequest(data: CreateViewingRequestRequest): Promise<ViewingRequest> {
    // For local development, simulate success
    if (!process.env.REACT_APP_API_URL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          id: 'mock-request-001',
          listingId: data.listingId,
          phone: data.phone,
          timeSlot: data.timeSlot,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }), 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/viewing-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create viewing request');
    }
    return response.json();
  },

  async getViewingRequests(): Promise<ViewingRequest[]> {
    const response = await fetch(`${API_BASE_URL}/viewing-requests`);
    if (!response.ok) {
      throw new Error('Failed to fetch viewing requests');
    }
    return response.json();
  },

  async approveViewingRequest(id: string): Promise<ViewingRequest> {
    const response = await fetch(`${API_BASE_URL}/viewing-requests/${id}/approve`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve viewing request');
    }
    return response.json();
  },
}; 