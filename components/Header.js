// components/Header.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      if (router.pathname !== '/') {
        router.push('/', undefined, { shallow: true }).then(() => {
          setTimeout(() => {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      } else {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-80 transition-opacity">
            canvasgenie.ai
          </Link>
          {isMobile ? (
            <button onClick={toggleMenu} className="text-gray-300 hover:text-white transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          ) : (
            <nav>
              <a href="#about-section" onClick={scrollToAbout} className="text-gray-300 hover:text-white transition-colors mr-4">
                About
              </a>
              <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                Support
              </Link>
            </nav>
          )}
        </div>
        {isMobile && isMenuOpen && (
          <nav className="mt-4">
            <a href="#about-section" onClick={scrollToAbout} className="block text-gray-300 hover:text-white transition-colors py-2">
              About
            </a>
            <Link href="/support" className="block text-gray-300 hover:text-white transition-colors py-2">
              Support
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;