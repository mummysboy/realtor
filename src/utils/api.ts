import { Listing, ViewingRequest, CreateListingRequest, CreateViewingRequestRequest } from '../types';

// Replace with your actual API Gateway endpoint
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://iv1i2fe2b9.execute-api.us-west-1.amazonaws.com/prod').replace(/\/$/, '');

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

    try {
      const response = await fetch(`${API_BASE_URL}/listings`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
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
    // For local development, return mock data
    if (!process.env.REACT_APP_API_URL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          id: 'mock-listing-001',
          ...data,
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }), 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create listing');
    }
    return response.json();
  },

  async updateListing(id: string, data: Partial<CreateListingRequest>): Promise<Listing> {
    // For local development, return mock data
    if (!process.env.REACT_APP_API_URL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({
          id,
          title: data.title || '',
          description: data.description || '',
          rent: data.rent || 0,
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          sqft: data.sqft || 0,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          images: [],
          availableTimes: data.availableTimes || ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }), 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update listing');
    }
    return response.json();
  },

  async deleteListing(id: string): Promise<void> {
    // For local development, simulate success
    if (!process.env.REACT_APP_API_URL) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
    }

    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete listing');
    }
  },

  async uploadImage(file: File): Promise<string> {
    console.log('🖼️ uploadImage called with file:', file.name, file.type, file.size);
    
    // For local development, return a placeholder
    if (!process.env.REACT_APP_API_URL) {
      console.log('🖼️ Using local development - returning placeholder');
      const placeholderImages = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      ];
      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      return new Promise((resolve) => {
        setTimeout(() => resolve(placeholderImages[randomIndex]), 500);
      });
    }

    try {
      console.log('🖼️ Converting file to base64...');
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = result.split(',')[1];
          console.log('🖼️ Base64 conversion complete, length:', base64.length);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      console.log('🖼️ Uploading to S3 via Lambda...');
      // Upload to S3 via Lambda
      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Data,
          fileName: file.name,
          contentType: file.type,
        }),
      });

      console.log('🖼️ Upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🖼️ Upload failed:', errorText);
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      console.log('🖼️ Upload successful, returned URL:', result.imageUrl);
      return result.imageUrl;
    } catch (error) {
      console.error('🖼️ Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
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