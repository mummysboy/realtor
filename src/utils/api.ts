import { Listing, ViewingRequest, CreateListingRequest, CreateViewingRequestRequest } from '../types';

// Replace with your actual API Gateway endpoint
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://iv1i2fe2b9.execute-api.us-west-1.amazonaws.com/prod').replace(/\/$/, '');

export const api = {
  // Listings
  async getListings(): Promise<Listing[]> {
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
    const response = await fetch(`${API_BASE_URL}/listings/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }
    return response.json();
  },

  async createListing(data: CreateListingRequest): Promise<Listing> {
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
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete listing');
    }
  },

  async uploadImage(file: File): Promise<string> {
    console.log('🖼️ uploadImage called with file:', file.name, file.type, file.size);
    
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

  async denyViewingRequest(id: string): Promise<ViewingRequest> {
    const response = await fetch(`${API_BASE_URL}/viewing-requests/${id}/deny`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      throw new Error('Failed to deny viewing request');
    }
    return response.json();
  },

  async cancelAppointment(id: string, message: string): Promise<ViewingRequest> {
    const response = await fetch(`${API_BASE_URL}/viewing-requests/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel appointment');
    }
    return response.json();
  },
}; 