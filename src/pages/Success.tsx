import React from 'react';
import { Link } from 'react-router-dom';

const Success: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Viewing Request Submitted!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your interest! We've received your viewing request and will contact you via SMS once it's approved.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• We'll review your request within 24 hours</li>
            <li>• You'll receive an SMS confirmation if approved</li>
            <li>• We'll coordinate the viewing time with you</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Browse More Listings
          </Link>
          
          <Link
            to="/admin"
            className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success; 