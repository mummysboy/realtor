import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { api } from '../utils/api';

const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getListings();
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const formatPrice = (price: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `$${price}`;
    }
  };

  const handleViewDetails = (listing: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSelectedListing(listing);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error opening listing details:', error);
      setError('Failed to open property details. Please try again.');
    }
  };

  const closeModal = () => {
    try {
      setSelectedListing(null);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };

  const nextImage = () => {
    if (selectedListing) {
      try {
        setCurrentImageIndex((prev) => 
          prev === selectedListing.images.length - 1 ? 0 : prev + 1
        );
      } catch (error) {
        console.error('Error navigating to next image:', error);
      }
    }
  };

  const prevImage = () => {
    if (selectedListing) {
      try {
        setCurrentImageIndex((prev) => 
          prev === 0 ? selectedListing.images.length - 1 : prev - 1
        );
      } catch (error) {
        console.error('Error navigating to previous image:', error);
      }
    }
  };

  const handleImageError = (listingId: string, imageIndex: number) => {
    setImageError(prev => ({
      ...prev,
      [`${listingId}-${imageIndex}`]: true
    }));
  };

  const filteredListings = listings.filter(listing => {
    try {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = (!selectedFilters.minPrice || listing.rent >= parseInt(selectedFilters.minPrice)) &&
                          (!selectedFilters.maxPrice || listing.rent <= parseInt(selectedFilters.maxPrice));
      
      const matchesBedrooms = !selectedFilters.bedrooms || 
        (selectedFilters.bedrooms === '0' ? listing.bedrooms === 0 : listing.bedrooms >= parseInt(selectedFilters.bedrooms));
      const matchesBathrooms = !selectedFilters.bathrooms || listing.bathrooms >= parseInt(selectedFilters.bathrooms);
      
      return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms;
    } catch (error) {
      console.error('Error filtering listings:', error);
      return true; // Show all listings if filtering fails
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Finding your perfect home...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Oops!</h2>
          <p className="text-secondary-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors animate-bounce-gentle"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">No Listings Available</h2>
          <p className="text-secondary-600">Check back soon for new rental opportunities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-secondary-200 fixed top-0 left-0 right-0 z-20 transition-transform duration-300 translate-y-0">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Find Your Perfect Home</h1>
            <p className="text-secondary-600">Discover amazing rental properties in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search by location, property type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-secondary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              <svg className="w-5 h-5 text-secondary-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              <select
                value={selectedFilters.minPrice}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="px-4 py-2 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">Min Price</option>
                <option value="1000">$1,000</option>
                <option value="1500">$1,500</option>
                <option value="2000">$2,000</option>
                <option value="2500">$2,500</option>
                <option value="3000">$3,000</option>
              </select>

              <select
                value={selectedFilters.maxPrice}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="px-4 py-2 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">Max Price</option>
                <option value="2000">$2,000</option>
                <option value="2500">$2,500</option>
                <option value="3000">$3,000</option>
                <option value="3500">$3,500</option>
                <option value="4000">$4,000</option>
              </select>

              <select
                value={selectedFilters.bedrooms}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="px-4 py-2 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">Rooms</option>
                <option value="0">Studio</option>
                <option value="1">1+ Room</option>
                <option value="2">2+ Rooms</option>
                <option value="3">3+ Rooms</option>
                <option value="4">4+ Rooms</option>
              </select>

              <select
                value={selectedFilters.bathrooms}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                className="px-4 py-2 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">Bathrooms</option>
                <option value="1">1+ Bath</option>
                <option value="2">2+ Bath</option>
                <option value="3">3+ Bath</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-64"></div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            {filteredListings.length} Properties Found
          </h2>
          <p className="text-secondary-600">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Browse our selection of quality rental properties'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden animate-fade-in"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={listing.images[0] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNEY0NkU1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9wZXJ0eTwvdGV4dD4KPC9zdmc+"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRUY0NDQ0Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcnJvcjwvdGV4dD4KPC9zdmc+";
                  }}
                />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <span className="text-lg font-bold text-primary-600">
                    {formatPrice(listing.rent)}
                  </span>
                  <span className="text-sm text-secondary-500">/mo</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-1">
                  {listing.title}
                </h3>
                
                <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                  {listing.address}, {listing.city}, {listing.state}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-secondary-500">
                      <span className="mr-1">🛏️</span>
{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} room${listing.bedrooms !== 1 ? 's' : ''}`}
                    </span>
                    <span className="flex items-center text-secondary-500">
                      <span className="mr-1">🚿</span>
                      {listing.bathrooms} bath
                    </span>
                    <span className="flex items-center text-secondary-500">
                      <span className="mr-1">📏</span>
                      {listing.sqft} sqm
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button 
                  onClick={(e) => handleViewDetails(listing, e)}
                  className="w-full mt-4 bg-primary-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2">No Properties Found</h3>
            <p className="text-secondary-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilters({ minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '' });
              }}
              className="bg-primary-500 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg sm:text-2xl font-bold text-secondary-900 truncate pr-4">
                {selectedListing.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Gallery */}
              <div className="relative">
                <div className="relative h-64 sm:h-80 md:h-[300px] lg:h-[350px] xl:h-[400px]">
                  <img
                    src={selectedListing.images[currentImageIndex] || '/placeholder-house.jpg'}
                    alt={`${selectedListing.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-house.jpg';
                      handleImageError(selectedListing.id, currentImageIndex);
                    }}
                  />
                  
                  {/* Navigation Arrows */}
                  {selectedListing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Image Indicators */}
                {selectedListing.images.length > 1 && (
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
                    {selectedListing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Price and Location */}
                <div className="space-y-2">
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                    {formatPrice(selectedListing.rent)}
                    <span className="text-base sm:text-lg text-secondary-500">/month</span>
                  </div>
                  <p className="text-sm sm:text-base text-secondary-600">
                    📍 {selectedListing.address}, {selectedListing.city}, {selectedListing.state}
                  </p>
                </div>

                {/* Property Specs */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                  <span className="flex items-center text-secondary-700 bg-gray-50 px-3 py-1.5 rounded-full">
                    <span className="mr-2">🛏️</span>
                    {selectedListing.bedrooms} room{selectedListing.bedrooms !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center text-secondary-700 bg-gray-50 px-3 py-1.5 rounded-full">
                    <span className="mr-2">🚿</span>
                    {selectedListing.bathrooms} bath
                  </span>
                  <span className="flex items-center text-secondary-700 bg-gray-50 px-3 py-1.5 rounded-full">
                    <span className="mr-2">📏</span>
                    {selectedListing.sqft} sqm
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2 sm:mb-3">Description</h3>
                  <p className="text-sm sm:text-base text-secondary-600 leading-relaxed">
                    {selectedListing.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/listing/${selectedListing.id}`);
                  }}
                  className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-600 transition-colors text-sm sm:text-base"
                >
                  Schedule Viewing
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 