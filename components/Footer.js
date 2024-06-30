// components/Footer.js
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            CanvasGenie.ai
          </p>
          <nav className="flex space-x-4">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;