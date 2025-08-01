import { Listing, ViewingRequest, CreateListingRequest, CreateViewingRequestRequest } from '../types';

// Replace with your actual API Gateway endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-gateway-url.amazonaws.com/prod';

// Mock data for local development
const mockListings: Listing[] = [
  {
    id: 'listing-001',
    title: 'Modern Rothschild Apartment',
    description: 'Beautiful 2-room apartment in the heart of Rothschild Boulevard. Features include hardwood floors, stainless steel appliances, and a private balcony with city views. Walking distance to restaurants, shopping, and public transportation.',
    rent: 8500,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 65,
    address: '123 Rothschild Boulevard',
    city: 'Tel Aviv',
    state: 'Israel',
    zipCode: '65132',
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
    title: 'Cozy Neve Tzedek Studio',
    description: 'Charming 1-room studio in the historic Neve Tzedek neighborhood. Features a large balcony, updated kitchen, and modern amenities. Perfect for young professionals seeking a trendy location.',
    rent: 6500,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 45,
    address: '456 Shabazi Street',
    city: 'Tel Aviv',
    state: 'Israel',
    zipCode: '65132',
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
    title: 'Luxury Sarona Loft',
    description: 'Stunning 3-room loft in the upscale Sarona complex. Features floor-to-ceiling windows, modern amenities, fitness center access, and rooftop pool. Ideal for professionals seeking a premium lifestyle.',
    rent: 12000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 95,
    address: '789 Sarona Street',
    city: 'Tel Aviv',
    state: 'Israel',
    zipCode: '65234',
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
    title: 'Historic Jaffa Apartment',
    description: 'Beautifully restored 4-room apartment with original architectural details in the historic Jaffa port area. Features include exposed stone walls, high ceilings, and a private terrace. Located in a historic district with easy access to the beach.',
    rent: 9500,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 120,
    address: '321 Yefet Street',
    city: 'Tel Aviv',
    state: 'Israel',
    zipCode: '68036',
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
    title: 'Beachfront Studio',
    description: 'Modern studio apartment with open floor plan and beach views. Features high ceilings, large windows, and built-in storage. Perfect for young professionals or students. Located just steps from the Mediterranean Sea.',
    rent: 7500,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 35,
    address: '654 Ben Yehuda Street',
    city: 'Tel Aviv',
    state: 'Israel',
    zipCode: '63405',
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

// Mock viewing requests data
const mockViewingRequests: ViewingRequest[] = [
  {
    id: 'request-001',
    listingId: 'listing-001',
    phone: '(555) 123-4567',
    timeSlot: '10:00 AM',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: 'request-002',
    listingId: 'listing-002',
    phone: '(555) 234-5678',
    timeSlot: '2:00 PM',
    status: 'confirmed',
    createdAt: '2024-01-14T14:20:00.000Z',
    updatedAt: '2024-01-14T16:45:00.000Z',
  },
  {
    id: 'request-003',
    listingId: 'listing-003',
    phone: '(555) 345-6789',
    timeSlot: '11:00 AM',
    status: 'pending',
    createdAt: '2024-01-15T09:15:00.000Z',
    updatedAt: '2024-01-15T09:15:00.000Z',
  },
  {
    id: 'request-004',
    listingId: 'listing-001',
    phone: '(555) 456-7890',
    timeSlot: '3:00 PM',
    status: 'confirmed',
    createdAt: '2024-01-13T11:00:00.000Z',
    updatedAt: '2024-01-13T15:30:00.000Z',
  },
  {
    id: 'request-005',
    listingId: 'listing-004',
    phone: '(555) 567-8901',
    timeSlot: '9:00 AM',
    status: 'confirmed',
    createdAt: '2024-01-12T08:45:00.000Z',
    updatedAt: '2024-01-12T10:20:00.000Z',
  },
  {
    id: 'request-006',
    listingId: 'listing-005',
    phone: '(555) 678-9012',
    timeSlot: '4:00 PM',
    status: 'pending',
    createdAt: '2024-01-15T13:30:00.000Z',
    updatedAt: '2024-01-15T13:30:00.000Z',
  },
  {
    id: 'request-007',
    listingId: 'listing-002',
    phone: '(555) 789-0123',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    createdAt: '2024-01-11T16:20:00.000Z',
    updatedAt: '2024-01-11T18:15:00.000Z',
  },
  {
    id: 'request-008',
    listingId: 'listing-003',
    phone: '(555) 890-1234',
    timeSlot: '2:00 PM',
    status: 'pending',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
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
    // For local development, return mock data
    if (!process.env.REACT_APP_API_URL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockViewingRequests), 500); // Simulate network delay
      });
    }

    const response = await fetch(`${API_BASE_URL}/viewing-requests`);
    if (!response.ok) {
      throw new Error('Failed to fetch viewing requests');
    }
    return response.json();
  },

  async approveViewingRequest(id: string): Promise<ViewingRequest> {
    // For local development, simulate approval
    if (!process.env.REACT_APP_API_URL) {
      const request = mockViewingRequests.find(r => r.id === id);
      if (request) {
        request.status = 'confirmed';
        request.updatedAt = new Date().toISOString();
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(request || mockViewingRequests[0]), 500);
      });
    }

    const response = await fetch(`${API_BASE_URL}/viewing-requests/${id}/approve`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve viewing request');
    }
    return response.json();
  },
}; 