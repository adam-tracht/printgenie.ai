// components/CheckoutButton.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Function to calculate shipping cost
const calculateShipping = (price) => {
  const shippingPercentage = 0.2; // 20%
  const minimumShipping = 5;
  const shippingCost = Math.max(price * shippingPercentage, minimumShipping);
  return parseFloat(shippingCost.toFixed(2)); // Round to 2 decimal places
};

const CheckoutButton = ({ product, variant, imageUrl, imageId, isMockupGenerated }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleCheckout = async () => {
    // Check if mockup is generated before proceeding to checkout
    if (!isMockupGenerated) {
      setFeedbackMessage('Please generate a mockup before proceeding to checkout.');
      return;
    }

    setIsProcessing(true);
    setFeedbackMessage('');
    console.log('Checkout button clicked');
    console.log('Product:', product);
    console.log('Variant:', variant);
    console.log('Image URL:', imageUrl);
    console.log('Image ID:', imageId);

    // Calculate shipping cost
    const shippingCost = calculateShipping(variant.price);
    console.log('Shipping cost:', shippingCost);

    try {
      console.log('Loading Stripe...');
      const stripe = await stripePromise;
      console.log('Stripe loaded successfully');
      
      console.log('Creating checkout session...');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: product,
          variant: variant,
          imageUrl: imageUrl,
          imageId: imageId, // Include the image ID in the request
          shippingCost: shippingCost,
        }),
      });

      console.log('Checkout session response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to create checkout session. Server response:', errorData);
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      console.log('Checkout session created:', session);

      console.log('Redirecting to Stripe Checkout...');
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error('Stripe redirect error:', result.error.message);
        setFeedbackMessage('An error occurred during checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setFeedbackMessage('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      {feedbackMessage && (
        <p className="text-yellow-500 text-sm mt-2">{feedbackMessage}</p>
      )}
    </div>
  );
};

export default CheckoutButton;