import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Realitor</h3>
            <p className="text-secondary-300 leading-relaxed">
              Find your perfect rental property with ease. Browse listings, schedule viewings, and get notified instantly.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-secondary-300 hover:text-white transition-colors">
                  Browse Listings
                </a>
              </li>
              <li>
                <a href="/admin" className="text-secondary-300 hover:text-white transition-colors">
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">Contact</h3>
            <p className="text-secondary-300">
              Questions? Contact us at<br />
              <a href="mailto:info@realitor.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                info@realitor.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
          <p className="text-secondary-300">
            © 2024 Realitor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 