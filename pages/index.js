//pages/index.js
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import MainAppFlow from '../components/MainAppFlow';

const Header = () => (
  <header className="bg-gray-800 border-b border-gray-700">
    <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        printgenie.ai
      </h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Gallery</a></li>
          <li><a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">About</a></li>
        </ul>
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
      </main>
    </div>
  );
};

export default HomePage;