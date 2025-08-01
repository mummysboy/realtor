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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Schedule a Viewing
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
            Available Time Slots
          </label>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.timeSlot ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a time slot</option>
            {listing.availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm mt-1">{errors.timeSlot}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Viewing'}
        </button>
      </form>
      
      <p className="text-sm text-gray-500 mt-4">
        You'll receive an SMS confirmation once your request is approved.
      </p>
    </div>
  );
};

export default ScheduleForm; 