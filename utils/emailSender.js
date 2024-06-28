// utils/emailSender.js
const sgMail = require('@sendgrid/mail');

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send order confirmation email
async function sendOrderConfirmationEmail(orderDetails, mockupUrl) {
  const { recipient, id, items, total } = orderDetails;

  const msg = {
    to: recipient.email,
    from: 'hello@printgenie.ai', // This email should be verified with SendGrid
    subject: 'Your PrintGenie.ai Order Confirmation',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #6200ea;">Order Confirmation</h1>
          <p>Thank you for your purchase! We're excited to create your custom AI-generated artwork.</p>
          <h2>Order Details:</h2>
          <p><strong>Order ID:</strong> ${id}</p>
          <p><strong>Item:</strong> ${items[0].name}</p>
          <p><strong>Quantity:</strong> ${items[0].quantity}</p>
          <p><strong>Amount Paid:</strong> $${total.toFixed(2)}</p>
          <h2>Shipping Address:</h2>
          <p>${recipient.name}</p>
          <p>${recipient.address1}</p>
          ${recipient.address2 ? `<p>${recipient.address2}</p>` : ''}
          <p>${recipient.city}, ${recipient.state_code} ${recipient.zip}</p>
          <p>${recipient.country_code}</p>
          <h2>Your Product Mockup:</h2>
          <img src="${mockupUrl}" alt="Product Mockup" style="max-width: 100%; height: auto;">
          <p>If you have any questions about your order, please contact our support team at <a href="mailto:hello@printgenie.ai">hello@printgenie.ai</a>.</p>
          <p>Thank you for choosing PrintGenie.ai!</p>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}

module.exports = { sendOrderConfirmationEmail };