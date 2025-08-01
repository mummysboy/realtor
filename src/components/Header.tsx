import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide header on homepage when scrolling down
      if (location.pathname === '/') {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past initial 100px
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        // Always show header on other pages
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, location.pathname]);

  return (
    <header className={`bg-white/80 backdrop-blur-md border-b border-secondary-200 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Realitor
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-700 hover:text-primary-600'
              }`}
            >
              Listings
            </Link>
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/admin' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-secondary-700 hover:text-primary-600'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-secondary-700 hover:text-primary-600 p-2 rounded-lg hover:bg-secondary-100 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 