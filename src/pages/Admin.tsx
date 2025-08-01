import React, { useState, useEffect } from 'react';
import { Listing, ViewingRequest, CreateListingRequest, CreateViewingRequestRequest } from '../types';
import { api } from '../utils/api';
import ImageUpload from '../components/ImageUpload';
import AppointmentCard from '../components/AppointmentCard';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'requests' | 'schedule'>('create');
  const [listings, setListings] = useState<Listing[]>([]);
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state for creating listings (with File objects and string URLs for images)
  const [formData, setFormData] = useState<Omit<CreateListingRequest, 'images'> & { images: (File | string)[] }>({
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

  const handleImagesChange = (images: (File | string)[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const [editingListingId, setEditingListingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Upload images first
      const imageUrls: string[] = [];
      if (formData.images && formData.images.length > 0) {
        console.log('📸 Processing', formData.images.length, 'images...');
        for (const imageItem of formData.images) {
          if (typeof imageItem === 'string') {
            // This is an existing image URL, keep it
            imageUrls.push(imageItem);
            console.log('📸 Keeping existing image:', imageItem);
          } else {
            // This is a new File, upload it
            try {
              const imageUrl = await api.uploadImage(imageItem);
              imageUrls.push(imageUrl);
              console.log('📸 Uploaded image:', imageUrl);
            } catch (error) {
              console.error('📸 Failed to upload image:', imageItem.name, error);
              throw new Error(`Failed to upload image: ${imageItem.name}`);
            }
          }
        }
      }
      
      // Prepare listing data with image URLs
      const listingData = {
        ...formData,
        images: imageUrls, // Replace File objects with URLs
      };
      
      if (editingListingId) {
        // Update existing listing
        await api.updateListing(editingListingId, listingData);
        alert('Listing updated successfully!');
        setEditingListingId(null);
      } else {
        // Create new listing
        await api.createListing(listingData);
        alert('Listing created successfully!');
      }
      
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
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to save listing. Please try again.');
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

  const handleDenyRequest = async (requestId: string) => {
    try {
      await api.denyViewingRequest(requestId);
      fetchViewingRequests(); // Refresh the list
      alert('Viewing request denied.');
    } catch (error) {
      console.error('Error denying request:', error);
      alert('Failed to deny request. Please try again.');
    }
  };

  const handleEditListing = (listing: Listing) => {
    // Populate the form with the listing data
    // Include existing images as strings
    setFormData({
      title: listing.title,
      description: listing.description,
      rent: listing.rent,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      sqft: listing.sqft,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zipCode: listing.zipCode,
      images: listing.images as (File | string)[], // Include existing images
      availableTimes: listing.availableTimes,
    });
    
    // Set the editing listing ID
    setEditingListingId(listing.id);
    
    // Switch to the create tab to show the form
    setActiveTab('create');
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteListing(listingId);
      
      // Remove the listing from the local state
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      
      alert('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get pending requests (only show pending requests in the requests tab)
  const pendingRequests = viewingRequests.filter(request => request.status === 'pending');

  // Get approved appointments (for schedule tab)
  const approvedAppointments = viewingRequests.filter(request => request.status === 'confirmed');

  // Group appointments by date
  const groupAppointmentsByDate = (appointments: ViewingRequest[]) => {
    const grouped: { [key: string]: ViewingRequest[] } = {};
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });
    
    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate(approvedAppointments);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Admin Dashboard</h1>
          <p className="text-secondary-600">Manage listings and viewing requests</p>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-secondary-200 mb-6">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'create', label: 'Create', icon: '➕' },
              { id: 'manage', label: 'Listings', icon: '🏠' },
              { id: 'requests', label: 'Requests', icon: '📋' },
              { id: 'schedule', label: 'Schedule', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex flex-col items-center py-4 px-4 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Create Listing Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-2">
                {editingListingId ? 'Edit Listing' : 'Create New Listing'}
              </h2>
              <p className="text-secondary-600">
                {editingListingId ? 'Update your property details' : 'Add a new property to your portfolio'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                      Property Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Modern Downtown Apartment"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rent" className="block text-sm font-medium text-secondary-700 mb-2">
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
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="2200"
                      />
                    </div>

                    <div>
                      <label htmlFor="sqft" className="block text-sm font-medium text-secondary-700 mb-2">
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
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-secondary-700 mb-2">
                        Rooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-secondary-700 mb-2">
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
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">Address</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-secondary-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-secondary-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">Description</h3>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                    Property Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Describe the property features, amenities, and highlights..."
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">Photos</h3>
                
                <div>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={handleImagesChange}
                    maxImages={10}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                  submitting 
                    ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed' 
                    : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    {editingListingId ? 'Updating Listing...' : 'Creating Listing...'}
                  </div>
                ) : (
                  editingListingId ? 'Update Listing' : 'Create Listing'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Manage Listings Tab */}
        {activeTab === 'manage' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-secondary-900 mb-1">Manage Listings</h2>
              <p className="text-secondary-600 text-sm">{listings.length} properties in your portfolio</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-600">Loading listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-secondary-500 text-lg">No listings found.</p>
                <p className="text-secondary-400 text-sm mt-2">Create your first listing to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      {/* Property Image */}
                      <div className="flex-shrink-0">
                        <img
                          className="h-16 w-16 rounded-xl object-cover shadow-sm"
                          src={listing.images[0] || '/placeholder-house.jpg'}
                          alt={listing.title}
                        />
                      </div>
                      
                      {/* Property Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-3">
                            <h3 className="text-base font-bold text-secondary-900 mb-1 leading-tight">
                              {listing.title}
                            </h3>
                            <p className="text-secondary-600 text-xs leading-tight">
                              📍 {listing.city}, {listing.state}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-primary-600">
                              {formatPrice(listing.rent)}
                            </div>
                            <div className="text-xs text-secondary-500">per month</div>
                          </div>
                        </div>
                        
                        {/* Property Specs */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          <span className="flex items-center text-xs text-secondary-700 bg-white px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0">
                            <span className="mr-1 text-primary-500">🛏️</span>
                            {listing.bedrooms} room{listing.bedrooms !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center text-xs text-secondary-700 bg-white px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0">
                            <span className="mr-1 text-primary-500">🚿</span>
                            {listing.bathrooms} bath
                          </span>
                          <span className="flex items-center text-xs text-secondary-700 bg-white px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0">
                            <span className="mr-1 text-primary-500">📏</span>
                            {listing.sqft} sqm
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditListing(listing)}
                              className="text-xs text-primary-600 hover:text-primary-800 font-semibold px-2 py-1.5 rounded-lg hover:bg-primary-50 transition-all border border-primary-200 hover:border-primary-300"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteListing(listing.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all border border-red-200 hover:border-red-300"
                            >
                              🗑️ Delete
                            </button>
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

        {/* Viewing Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-2">Viewing Requests</h2>
              <p className="text-secondary-600">Review and approve viewing requests</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-600">Loading requests...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-secondary-500 text-lg">No pending requests.</p>
                <p className="text-secondary-400 text-sm mt-2">New viewing requests will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border-2 border-secondary-100 rounded-2xl p-4 hover:shadow-lg transition-all">
                    <div className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Property Info */}
                      <div className="bg-secondary-50 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg flex-shrink-0">🏠</span>
                          <span className="font-semibold text-secondary-900 truncate">
                            {listings.find(l => l.id === request.listingId)?.title || 'Unknown Property'}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 truncate">
                          {listings.find(l => l.id === request.listingId)?.address}, {listings.find(l => l.id === request.listingId)?.city}
                        </p>
                      </div>

                      {/* Contact and Time */}
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-secondary-900 flex-shrink-0">📱 Phone:</span>
                          <span className="text-sm text-secondary-600 font-mono truncate ml-2">{request.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-secondary-900 flex-shrink-0">🕐 Time:</span>
                          <span className="text-sm text-secondary-600 truncate ml-2">{request.timeSlot}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 active:bg-gray-300 border border-gray-200 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDenyRequest(request.id)}
                          className="flex-1 bg-gray-50 text-gray-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 active:bg-gray-200 border border-gray-100 transition-all"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab - Approved Appointments */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-2">Approved Appointments</h2>
              <p className="text-secondary-600 text-sm">{approvedAppointments.length} confirmed appointments</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-600">Loading appointments...</p>
              </div>
            ) : approvedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-secondary-500 text-lg">No approved appointments yet.</p>
                <p className="text-secondary-400 text-sm mt-2">Approve viewing requests to see them here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedAppointments).map(([date, appointments]) => (
                  <div key={date} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Date Header */}
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <h3 className="text-lg font-bold text-secondary-900">{date}</h3>
                        </div>
                        <span className="text-xs text-secondary-600 bg-white px-3 py-1 rounded-full border border-gray-200 flex-shrink-0">
                          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    
                    {/* Appointments */}
                    <div className="p-4 space-y-4">
                      {appointments.map((appointment) => {
                        const listing = listings.find(l => l.id === appointment.listingId);
                        const address = listing ? `${listing.address}, ${listing.city}, ${listing.state}` : 'N/A';
                        
                        return (
                          <AppointmentCard
                            key={appointment.id}
                            date={date}
                            listingTitle={listing?.title || 'Unknown Property'}
                            phone={appointment.phone}
                            address={address}
                            timeSlot={appointment.timeSlot}
                            status="confirmed"
                            onReschedule={(message: string) => {
                              // TODO: Implement reschedule functionality with message
                              console.log('Reschedule appointment:', appointment.id, 'Message:', message);
                              alert(`Reschedule request sent with message: ${message}`);
                            }}
                            onCancel={async (message: string) => {
                              try {
                                await api.cancelAppointment(appointment.id, message);
                                // Remove the appointment from the local state
                                setViewingRequests(prev => 
                                  prev.map(request => 
                                    request.id === appointment.id 
                                      ? { ...request, status: 'canceled' as const }
                                      : request
                                  )
                                );
                                alert('Appointment canceled successfully!');
                              } catch (error) {
                                console.error('Error canceling appointment:', error);
                                alert('Failed to cancel appointment. Please try again.');
                              }
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 