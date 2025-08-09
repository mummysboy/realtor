import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Debug logging
  console.log('🖼️ Debug: Rendering image for listing:', listing.title, 'Image URL:', listing.images[0]);

  return (
    <Link 
      to={`/listing/${listing.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
          alt={listing.title}
          className="w-full h-48 object-cover"
          onLoad={() => {
            console.log('🖼️ Debug: Image loaded successfully:', listing.images[0]);
          }}
          onError={(e) => {
            console.error('🖼️ Debug: Image failed to load:', listing.images[0]);
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
          }}
        />
        <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
          {formatPrice(listing.rent)}/mo
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {listing.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="mr-1">🛏️</span>
              {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} room${listing.bedrooms !== 1 ? 's' : ''}`}
            </span>
            <span className="flex items-center">
              <span className="mr-1">🚿</span>
              {listing.bathrooms} bath
            </span>
            <span className="flex items-center">
              <span className="mr-1">📏</span>
              {listing.sqft} sqm
            </span>
          </div>
          
          <span className="text-primary-600 font-medium">
            {formatPrice(listing.rent)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard; 