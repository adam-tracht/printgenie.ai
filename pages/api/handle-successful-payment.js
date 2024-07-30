// pages/api/handle-successful-payment.js
import Stripe from 'stripe';
import axios from 'axios';
import { sendOrderConfirmationEmail } from '../../utils/emailSender';
import { sendAdminNotificationEmail } from '../../utils/adminEmailSender';

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
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { session_id } = req.body;
  console.log('Received session_id:', session_id);

  try {
    // Retrieve the session from Stripe
    console.log('Retrieving Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer', 'line_items', 'total_details']
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

    // Add the total, subtotal, tax, and customer email to the order details
    const orderWithDetails = {
      ...printfulOrder,
      total: total,
      subtotal: session.amount_subtotal / 100,
      tax: session.total_details.amount_tax / 100,
      recipient: {
        ...printfulOrder.recipient,
        email: session.customer_details.email,
      },
    };

    // Send order confirmation email
    let customerEmailSent = false;
    try {
      await sendOrderConfirmationEmail(orderWithDetails, mockupUrl);
      console.log('Order confirmation email sent successfully to customer');
      customerEmailSent = true;
    } catch (emailError) {
      console.error('Failed to send order confirmation email to customer:', emailError);
    }

    // Send admin notification email
    let adminEmailSent = false;
    try {
      await sendAdminNotificationEmail(orderWithDetails, mockupUrl);
      console.log('Admin notification email sent successfully');
      adminEmailSent = true;
    } catch (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError);
    }

    res.status(200).json({ 
      order: orderWithDetails, 
      mockupUrl,
      customerEmailSent,
      adminEmailSent
    });
  } catch (error) {
    console.error('Error handling successful payment:', error);
    res.status(500).json({ error: 'Failed to process payment', details: error.message });
  }
}

async function createPrintfulOrder(session) {
  const { productId, variantId, mockupUrl } = session.metadata;
  console.log('Creating Printful order with metadata:', { productId, variantId, mockupUrl });

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

  // Get the first placement (usually 'default' for most products)
  const placement = Object.keys(variantPrintfile.placements)[0];
  console.log('Selected placement:', placement);

  // Get the printfile ID for the selected placement
  const printfileId = variantPrintfile.placements[placement];
  console.log('Selected printfile ID:', printfileId);

  // Find the printfile details
  const printfile = printfilesData.printfiles.find(pf => pf.printfile_id === printfileId);
  if (!printfile) {
    throw new Error(`Printfile not found for ID ${printfileId}`);
  }
  console.log('Printfile details:', printfile);

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
            url: mockupUrl, // Use the mockup URL here
            type: placement
          }
        ]
      }
    ]
  };

  console.log('Sending order data to Printful:', JSON.stringify(orderData, null, 2));

  try {
    const response = await printfulApi.post('/orders', orderData);
    console.log('Printful order response:', JSON.stringify(response.data, null, 2));
    return response.data.result;
  } catch (error) {
    console.error('Error creating Printful order:', error.response ? error.response.data : error.message);
    throw error;
  }
}