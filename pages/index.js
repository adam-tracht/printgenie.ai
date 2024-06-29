// pages/index.js
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import MainAppFlow from '../components/MainAppFlow';
import Header from '../components/Header';

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