// pages/cancel.js
import React from 'react';
import Link from 'next/link';

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Order Cancelled</h1>
        <p className="text-gray-300 mb-6">
          Your order has been cancelled. No charges were made.
        </p>
        <Link href="/">
          <a className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Return to Homepage
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CancelPage;