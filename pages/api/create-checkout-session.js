// pages/api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log('Create checkout session API called');

  if (req.method === 'POST') {
    try {
      const { product, variant, imageUrl, originalImageUrl, shippingCost } = req.body;
      console.log('Received product:', product);
      console.log('Received variant:', variant);
      console.log('Received imageUrl:', imageUrl);
      console.log('Received originalImageUrl:', originalImageUrl);
      console.log('Received shippingCost:', shippingCost);

      if (!product || !variant || !imageUrl || !originalImageUrl || shippingCost === undefined) {
        console.error('Missing required fields in request body');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create Stripe checkout session
      console.log('Creating Stripe checkout session...');
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${product.name} - ${variant.name}`,
                images: [imageUrl], // This is the mockup image
              },
              unit_amount: Math.round(variant.price * 100), // Convert to cents
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Shipping',
              },
              unit_amount: Math.round(shippingCost * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/`,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'], // Add more countries as needed
        },
        metadata: {
          productId: product.id,
          variantId: variant.id,
          mockupUrl: imageUrl, // This is the mockup image URL
          originalImageUrl: originalImageUrl, // This is the original AI-generated artwork URL
          shippingCost: shippingCost.toFixed(2), // Store shipping cost in metadata
        },
      });

      console.log('Checkout session created:', session.id);
      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: 'Error creating checkout session', details: err.message });
    }
  } else {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}