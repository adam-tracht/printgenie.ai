// pages/success.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [mockupUrl, setMockupUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      handleSuccessfulPayment(session_id);
    } else if (router.isReady) {
      setError('No session ID provided. Unable to process the order.');
      setIsLoading(false);
    }
  }, [session_id, router.isReady]);

  const handleSuccessfulPayment = async (sessionId) => {
    try {
      const response = await fetch('/api/handle-successful-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to process payment: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      setOrderDetails(data.order);
      setMockupUrl(data.mockupUrl);
    } catch (error) {
      console.error('Error handling successful payment:', error);
      setError(`An error occurred while processing your order: ${error.message}. Please contact support with this error message and your session ID: ${sessionId}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely access nested properties
  const safelyGetNestedProperty = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    if (typeof price === 'string' && !isNaN(parseFloat(price))) {
      return parseFloat(price).toFixed(2);
    }
    return 'N/A';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-4">Processing Order...</h1>
          <p className="text-gray-300 mb-4">Please wait while we process your order.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-white mb-6">{error}</p>
          <Link href="/" className="block w-full text-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-500 mb-4">Order Successful!</h1>
        <p className="text-white mb-4">
          Thank you for your purchase! We are excited to create your custom AI-generated artwork.
        </p>
        <p className="text-white mb-4">
          A confirmation email has been sent to your email address with all the order details.
        </p>
        {orderDetails && (
          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              Order ID: <span className="font-bold">{safelyGetNestedProperty(orderDetails, 'id')}</span>
            </p>
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h2 className="text-white font-bold mb-2">Order Summary</h2>
              <table className="w-full text-gray-300">
                <tbody>
                  <tr>
                    <td className="py-1">Item:</td>
                    <td className="text-right">{safelyGetNestedProperty(orderDetails, 'items.0.name')}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Quantity:</td>
                    <td className="text-right">{safelyGetNestedProperty(orderDetails, 'items.0.quantity')}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Item Price:</td>
                    <td className="text-right">${formatPrice(safelyGetNestedProperty(orderDetails, 'subtotal') - safelyGetNestedProperty(orderDetails, 'shipping'))}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Shipping:</td>
                    <td className="text-right">${formatPrice(safelyGetNestedProperty(orderDetails, 'shipping', 0))}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Subtotal:</td>
                    <td className="text-right">${formatPrice(safelyGetNestedProperty(orderDetails, 'subtotal', 0))}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Tax:</td>
                    <td className="text-right">${formatPrice(safelyGetNestedProperty(orderDetails, 'tax', 0))}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-1">Total Paid:</td>
                    <td className="text-right">${formatPrice(safelyGetNestedProperty(orderDetails, 'total', 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {mockupUrl && (
              <div className="mt-4">
                <p className="text-gray-300 mb-2">Your Product Mockup:</p>
                <div className="relative w-full aspect-square">
                  <Image
                    src={mockupUrl}
                    alt="Product Mockup"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-gray-300 mb-4">
          <strong>Shipping Information:</strong> Please allow up to 5 days for production and an additional 3-7 days for delivery.
        </p>
        <p className="text-gray-300 mb-4">
          If you have any questions about your order, please contact our support team at{' '}
          <a href="mailto:hello@canvasgenie.ai" className="text-purple-400 hover:text-purple-300">
            hello@canvasgenie.ai
          </a>
          .
        </p>
        <Link href="/" className="block w-full text-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;