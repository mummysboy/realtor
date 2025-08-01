import React from 'react';
import { Link } from 'react-router-dom';

const Success: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-sm">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-secondary-900 mb-4">
          Viewing Request Sent!
        </h1>
        
        <p className="text-secondary-600 mb-8 leading-relaxed">
          We've received your viewing request and will contact you via SMS once it's approved. 
          You'll receive a confirmation message shortly.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-primary-600 transition-colors transform hover:scale-105 active:scale-95"
          >
            Browse More Listings
          </Link>
          
          <div className="text-sm text-secondary-500">
            <p>Questions? Contact us at</p>
            <a href="mailto:info@realitor.com" className="text-primary-600 hover:text-primary-700">
              info@realitor.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success; 