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
  const [emailSent, setEmailSent] = useState(true);

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
      setEmailSent(data.emailSent);
    } catch (error) {
      console.error('Error handling successful payment:', error);
      setError(`An error occurred while processing your order: ${error.message}. Please contact support with this error message and your session ID: ${sessionId}`);
    } finally {
      setIsLoading(false);
    }
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
          Thank you for your purchase! We&apos;re excited to create your custom AI-generated artwork.
        </p>
        {emailSent ? (
          <p className="text-white mb-4">
            A confirmation email has been sent to your email address with all the order details.
          </p>
        ) : (
          <p className="text-yellow-400 mb-4">
            We encountered an issue sending your confirmation email. Don&apos;t worry, your order has been processed successfully. Please contact our support team if you need any information about your order.
          </p>
        )}
        {orderDetails && (
          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              Order ID: <span className="font-bold">{orderDetails.id}</span>
            </p>
            <p className="text-gray-300 mb-2">
              Item: <span className="font-bold">{orderDetails.items[0].name}</span>
            </p>
            <p className="text-gray-300 mb-2">
              Quantity: <span className="font-bold">{orderDetails.items[0].quantity}</span>
            </p>
            <p className="text-gray-300 mb-2">
              Subtotal: <span className="font-bold">${(orderDetails.amount_subtotal / 100).toFixed(2)}</span>
            </p>
            <p className="text-gray-300 mb-2">
              Tax: <span className="font-bold">${(orderDetails.total_details.amount_tax / 100).toFixed(2)}</span>
            </p>
            <p className="text-gray-300 mb-2">
              Total Paid: <span className="font-bold">${(orderDetails.amount_total / 100).toFixed(2)}</span>
            </p>
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