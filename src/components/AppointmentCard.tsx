import React from 'react';

interface AppointmentCardProps {
  date: string;
  listingTitle: string;
  phone: string;
  address: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'canceled';
  onReschedule: () => void;
  onCancel: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  date,
  listingTitle,
  phone,
  address,
  timeSlot,
  status,
  onReschedule,
  onCancel
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center text-green-700 bg-green-100 text-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center text-yellow-700 bg-yellow-100 text-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Pending
          </span>
        );
      case 'canceled':
        return (
          <span className="inline-flex items-center text-red-700 bg-red-100 text-sm px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Canceled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 my-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header with Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <span className="text-lg font-semibold text-gray-900 truncate">
              {timeSlot}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-row space-x-3 sm:space-x-4 justify-end">
            <button
              onClick={onReschedule}
              aria-label="Reschedule appointment"
              className="text-sm text-primary-600 hover:text-primary-800 font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 transition-all border border-primary-200 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reschedule
            </button>
            <button
              onClick={onCancel}
              aria-label="Cancel appointment"
              className="text-sm text-red-600 hover:text-red-800 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all border border-red-200 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
        
        {/* Property Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-gray-900 flex-shrink-0">🏠 Property:</span>
            <span 
              className="text-sm text-gray-600 truncate ml-2 text-right"
              title={listingTitle}
            >
              {listingTitle}
            </span>
          </div>
          
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-gray-900 flex-shrink-0">📱 Phone:</span>
            <span 
              className="text-sm text-gray-600 font-mono truncate ml-2 text-right"
              title={phone}
            >
              {phone}
            </span>
          </div>
          
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-gray-900 flex-shrink-0">📍 Address:</span>
            <span 
              className="text-sm text-gray-600 truncate ml-2 text-right max-w-xs"
              title={address}
            >
              {address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard; 