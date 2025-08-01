import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Realitor</h3>
            <p className="text-gray-300">
              Find your perfect rental property with ease. Browse listings, schedule viewings, and get notified instantly.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Browse Listings
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-300 hover:text-white">
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Questions? Contact us at<br />
              <a href="mailto:info@realitor.com" className="text-primary-400 hover:text-primary-300">
                info@realitor.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Realitor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 