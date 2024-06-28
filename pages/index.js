//pages/index.js
import React from 'react';
import Link from 'next/link';
import ErrorBoundary from '../components/ErrorBoundary';
import MainAppFlow from '../components/MainAppFlow';
import Gallery from '../components/Gallery';

const Header = () => (
  <header className="bg-gray-800 border-b border-gray-700">
    <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-80 transition-opacity">
        canvasgenie.ai
      </Link>
      <nav>
        <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
          Support
        </Link>
      </nav>
    </div>
  </header>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary>
            <MainAppFlow />
          </ErrorBoundary>
        </div>
        <div id="gallery">
          <ErrorBoundary>
            <Gallery />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default HomePage;