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
  const [showImageGallery, setShowImageGallery] = useState(false);

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

  const nextImage = () => {
    if (listing && currentImageIndex < listing.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">Listing Not Found</h2>
          <p className="text-secondary-600 mb-6">{error || 'This listing could not be found.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-secondary-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-secondary-900">Property Details</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24">
        {/* Image Gallery */}
        <div className="relative h-[60vh] bg-black">
          <img
            src={listing.images[currentImageIndex] || '/placeholder-house.jpg'}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-house.jpg';
            }}
          />
          
          {/* Image Navigation */}
          {listing.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                disabled={currentImageIndex === listing.images.length - 1}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(listing.rent)}
            </span>
            <span className="text-sm text-secondary-500">/mo</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 -mt-6 relative z-10">
          <div className="bg-white rounded-t-3xl shadow-2xl p-6 min-h-[40vh]">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                {listing.title}
              </h1>
              
              <p className="text-secondary-600 text-sm mb-4">
                {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
              </p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{listing.bedrooms}</div>
                  <div className="text-xs text-secondary-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{listing.bathrooms}</div>
                  <div className="text-xs text-secondary-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{listing.sqft}</div>
                  <div className="text-xs text-secondary-500">Sq Ft</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Description</h3>
              <p className="text-secondary-600 leading-relaxed">
                {listing.description}
              </p>
            </div>
            
            {/* Thumbnail Gallery */}
            {listing.images.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Photos</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-primary-500' : 'ring-1 ring-secondary-200'
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sheet - Schedule Form */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl animate-slide-up">
        <div className="px-4 py-6">
          <ScheduleForm
            listing={listing}
            onSubmit={handleScheduleViewing}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 