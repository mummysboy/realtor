import React, { useState, useEffect } from 'react';
import { Listing, ViewingRequest, CreateListingRequest } from '../types';
import { api } from '../utils/api';
import ImageUpload from '../components/ImageUpload';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'requests'>('create');
  const [listings, setListings] = useState<Listing[]>([]);
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state for creating listings
  const [formData, setFormData] = useState<CreateListingRequest>({
    title: '',
    description: '',
    rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    images: [],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
  });

  useEffect(() => {
    fetchListings();
    fetchViewingRequests();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await api.getListings();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchViewingRequests = async () => {
    try {
      setLoading(true);
      const requests = await api.getViewingRequests();
      setViewingRequests(requests);
    } catch (error) {
      console.error('Error fetching viewing requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rent' || name === 'bedrooms' || name === 'bathrooms' || name === 'sqft' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleImagesChange = (images: File[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await api.createListing(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        rent: 0,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 0,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        images: [],
        availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
      });
      
      // Refresh listings
      fetchListings();
      
      alert('Listing created successfully!');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await api.approveViewingRequest(requestId);
      fetchViewingRequests(); // Refresh the list
      alert('Viewing request approved!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage listings and viewing requests</p>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="border-b border-gray-200 mb-6 sm:mb-8">
        <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-shrink-0 py-2 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'create'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Listing
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-shrink-0 py-2 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'manage'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Listings
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-shrink-0 py-2 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'requests'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Viewing Requests
          </button>
        </nav>
      </div>

      {/* Create Listing Tab */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Create New Listing</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent
                </label>
                <input
                  type="number"
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="sqft" className="block text-sm font-medium text-gray-700 mb-1">
                  Square Feet
                </label>
                <input
                  type="number"
                  id="sqft"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <ImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                maxImages={10}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-sm sm:text-base ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Creating...' : 'Create Listing'}
            </button>
          </form>
        </div>
      )}

      {/* Manage Listings Tab - Mobile First */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Manage Listings</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No listings found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={listing.images[0] || '/placeholder-house.jpg'}
                        alt={listing.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {listing.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {listing.city}, {listing.state}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs sm:text-sm text-gray-600">
                            <span>{listing.bedrooms} bed</span>
                            <span>{listing.bathrooms} bath</span>
                            <span>{listing.sqft} sqft</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm sm:text-base font-semibold text-primary-600">
                            {formatPrice(listing.rent)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">per month</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button className="text-xs sm:text-sm text-primary-600 hover:text-primary-900 font-medium">
                            Edit
                          </button>
                          <button className="text-xs sm:text-sm text-red-600 hover:text-red-900 font-medium">
                            Delete
                          </button>
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {listing.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Viewing Requests Tab - Mobile First */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Viewing Requests</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">Loading requests...</p>
            </div>
          ) : viewingRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No viewing requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {viewingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Phone:</span>
                          <span className="text-sm text-gray-600">{request.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Time Slot:</span>
                          <span className="text-sm text-gray-600">{request.timeSlot}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Request ID:</span>
                          <span className="text-xs text-gray-400 font-mono">{request.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-primary-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium hover:bg-primary-700 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin; 