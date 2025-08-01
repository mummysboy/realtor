import React, { useState } from 'react';
import { Listing } from '../types';

interface ScheduleFormProps {
  listing: Listing;
  onSubmit: (phone: string, timeSlot: string) => Promise<void>;
  isSubmitting: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ listing, onSubmit, isSubmitting }) => {
  const [phone, setPhone] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; timeSlot?: string }>({});

  const validateForm = () => {
    const newErrors: { phone?: string; timeSlot?: string } = {};
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(phone, timeSlot);
    } catch (error) {
      console.error('Error submitting form:', error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-secondary-900 mb-2">
          Schedule a Viewing
        </h3>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="mr-1">🛏️</span>
                  {listing.bedrooms} room{listing.bedrooms !== 1 ? 's' : ''}
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
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className={`w-full px-4 py-4 text-lg border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                errors.phone ? 'border-red-500' : 'border-secondary-200'
              }`}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phone}
            </p>
          )}
        </div>
        
        {/* Time Slot Selection */}
        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-secondary-700 mb-2">
            Available Time Slots
          </label>
          <div className="grid grid-cols-2 gap-3">
            {listing.availableTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimeSlot(time)}
                className={`px-4 py-4 text-center rounded-2xl border-2 transition-all ${
                  timeSlot === time
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 text-secondary-700 hover:border-primary-300'
                }`}
              >
                <div className="text-sm font-medium">{time}</div>
              </button>
            ))}
          </div>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.timeSlot}
            </p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Scheduling...
            </div>
          ) : (
            'Schedule Viewing'
          )}
        </button>
      </form>
      
      {/* Info Text */}
      <div className="text-center">
        <p className="text-sm text-secondary-500">
          You'll receive an SMS confirmation once your request is approved.
        </p>
      </div>
    </div>
  );
};

export default ScheduleForm; 