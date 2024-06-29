// components/CheckoutButton.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ product, variant, imageUrl, originalImageUrl, isMockupGenerated, setFeedbackMessage }) => {
  const handleCheckout = async () => {
    if (!isMockupGenerated) {
      setFeedbackMessage('Please generate a mockup before proceeding to checkout.');
      return;
    }

    console.log('Checkout button clicked');
    console.log('Product:', product);
    console.log('Variant:', variant);
    console.log('Image URL:', imageUrl);
    console.log('Original Image URL:', originalImageUrl);

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
          originalImageUrl: originalImageUrl,
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
        alert('An error occurred during checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      Proceed to Checkout
    </button>
  );
};

export default CheckoutButton;
