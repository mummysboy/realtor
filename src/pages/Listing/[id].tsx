import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScheduleForm from '../../components/ScheduleForm';
import { Listing } from '../../types';
import { api } from '../../utils/api';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await api.getListingById(id);
        setListing(data);
      } catch (err) {
        setError('Failed to load listing details. Please try again later.');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleScheduleViewing = async (phone: string, timeSlot: string) => {
    if (!listing) return;
    
    try {
      setIsSubmitting(true);
      await api.createViewingRequest({
        listingId: listing.id,
        phone,
        timeSlot,
      });
      
      // Redirect to success page
      navigate('/success');
    } catch (err) {
      console.error('Error creating viewing request:', err);
      alert('Failed to schedule viewing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This listing could not be found.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-6">
            <div className="relative">
              <img
                src={listing.images[currentImageIndex] || '/placeholder-house.jpg'}
                alt={listing.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-house.jpg';
                }}
              />
              
              {/* Image Navigation */}
              {listing.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {listing.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-house.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
              <div className="text-2xl font-bold text-primary-600">
                {formatPrice(listing.rent)}/mo
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{listing.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{listing.bedrooms}</div>
                <div className="text-sm text-gray-500">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{listing.bathrooms}</div>
                <div className="text-sm text-gray-500">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{listing.sqft}</div>
                <div className="text-sm text-gray-500">Square Feet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{listing.availableTimes.length}</div>
                <div className="text-sm text-gray-500">Available Times</div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">
                {listing.address}<br />
                {listing.city}, {listing.state} {listing.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Schedule Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <ScheduleForm
              listing={listing}
              onSubmit={handleScheduleViewing}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 