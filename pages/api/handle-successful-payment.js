// pages/api/handle-successful-payment.js
import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const printfulApi = axios.create({
  baseURL: 'https://api.printful.com',
  headers: {
    'Authorization': `Bearer ${process.env.PRINTFUL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export default async function handler(req, res) {
  console.log('Handle successful payment API called');
  
  if (req.method === 'POST') {
    const { session_id } = req.body;
    console.log('Received session_id:', session_id);

    try {
      // Retrieve the session from Stripe
      console.log('Retrieving Stripe session...');
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['customer', 'line_items']
      });
      console.log('Stripe session retrieved:', session);

      // Create Printful order
      console.log('Creating Printful order...');
      const printfulOrder = await createPrintfulOrder(session);
      console.log('Printful order created:', printfulOrder);

      // Get the mockup URL from the session metadata
      const mockupUrl = session.metadata.mockupUrl;

      // Calculate the total from the Stripe session
      const total = session.amount_total / 100; // Convert from cents to dollars

      // Add the total to the order details
      const orderWithTotal = {
        ...printfulOrder,
        total: total
      };

      res.status(200).json({ order: orderWithTotal, mockupUrl });
    } catch (error) {
      console.error('Error handling successful payment:', error);
      res.status(500).json({ error: 'Failed to process payment', details: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

async function createPrintfulOrder(session) {
  const { productId, variantId, mockupUrl, originalImageUrl } = session.metadata;
  console.log('Creating Printful order with metadata:', { productId, variantId, mockupUrl, originalImageUrl });

  // Fetch printfiles for the product
  console.log('Fetching printfiles...');
  const printfilesResponse = await printfulApi.get(`/mockup-generator/printfiles/${productId}`);
  const printfilesData = printfilesResponse.data.result;
  console.log('Printfiles fetched:', printfilesData);

  // Find the correct printfile for this variant
  const variantPrintfile = printfilesData.variant_printfiles.find(vp => vp.variant_id === parseInt(variantId));
  if (!variantPrintfile) {
    throw new Error(`No printfile found for variant ${variantId}`);
  }
  console.log('Variant printfile found:', variantPrintfile);

  // Get the first placement (usually 'front' for most products)
  const placement = Object.keys(variantPrintfile.placements)[0];
  console.log('Selected placement:', placement);

  const orderData = {
    recipient: {
      name: session.shipping_details.name,
      address1: session.shipping_details.address.line1,
      address2: session.shipping_details.address.line2,
      city: session.shipping_details.address.city,
      state_code: session.shipping_details.address.state,
      country_code: session.shipping_details.address.country,
      zip: session.shipping_details.address.postal_code
    },
    items: [
      {
        variant_id: parseInt(variantId),
        quantity: 1,
        files: [
          {
            url: originalImageUrl,
            type: placement,
            placement: placement
          }
        ]
      }
    ]
  };

  console.log('Sending order data to Printful:', JSON.stringify(orderData, null, 2));

  const response = await printfulApi.post('/orders', orderData);

  console.log('Printful order response:', JSON.stringify(response.data, null, 2));

  return response.data.result;
}