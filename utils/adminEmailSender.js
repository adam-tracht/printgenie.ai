// utils/adminEmailSender.js
const sgMail = require('@sendgrid/mail');

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send admin notification email
async function sendAdminNotificationEmail(orderDetails, mockupUrl) {
  const { id, items, total, recipient } = orderDetails;

  const msg = {
    to: 'hello@canvasgenie.ai',
    from: 'hello@canvasgenie.ai', // This email should be verified with SendGrid
    subject: 'New Order Notification - CanvasGenie.ai',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification - CanvasGenie.ai</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #6200ea;
          }
          .order-details {
            background-color: #f0f0f4;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .mockup-image {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>New Order Notification</h1>
        <p>A new order has been placed on CanvasGenie.ai:</p>
        
        <div class="order-details">
          <h2>Order Details:</h2>
          <p><strong>Order ID:</strong> ${id}</p>
          <p><strong>Item:</strong> ${items[0].name}</p>
          <p><strong>Quantity:</strong> ${items[0].quantity}</p>
          <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
        </div>
        
        <h2>Customer Information:</h2>
        <p>
          <strong>Name:</strong> ${recipient.name}<br>
          <strong>Email:</strong> ${recipient.email}<br>
          <strong>Address:</strong><br>
          ${recipient.address1}<br>
          ${recipient.address2 ? `${recipient.address2}<br>` : ''}
          ${recipient.city}, ${recipient.state_code} ${recipient.zip}<br>
          ${recipient.country_code}
        </p>
        
        <h2>Product Mockup:</h2>
        <img src="${mockupUrl}" alt="Product Mockup" class="mockup-image">
        
        <p>Please review this order and ensure it is processed correctly.</p>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}

module.exports = { sendAdminNotificationEmail };