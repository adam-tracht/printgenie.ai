// utils/emailSender.js
const sgMail = require('@sendgrid/mail');

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send order confirmation email
async function sendOrderConfirmationEmail(orderDetails, mockupUrl) {
  const { recipient, id, items, total, subtotal, tax } = orderDetails;

  const msg = {
    to: recipient.email,
    from: 'hello@canvasgenie.ai', // This email should be verified with SendGrid
    subject: 'Your CanvasGenie.ai Order Confirmation',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CanvasGenie.ai Order Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background-color: #6200ea;
            color: #ffffff;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
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
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
          }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
            }
          }
        </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
            </div>
            <div class="content">
              <p>Thank you for your purchase! We're excited to create your custom AI-generated artwork.</p>
              
              <div class="order-details">
                <h2>Order Details:</h2>
                <p><strong>Order ID:</strong> ${id}</p>
                <p><strong>Item:</strong> ${items[0].name}</p>
                <p><strong>Quantity:</strong> ${items[0].quantity}</p>
                <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                <p><strong>Tax:</strong> $${tax.toFixed(2)}</p>
                <p><strong>Total Amount Paid:</strong> $${total.toFixed(2)}</p>
              </div>
              
              <h2>Shipping Address:</h2>
              <p>
                ${recipient.name}<br>
                ${recipient.address1}<br>
                ${recipient.address2 ? `${recipient.address2}<br>` : ''}
                ${recipient.city}, ${recipient.state_code} ${recipient.zip}<br>
                ${recipient.country_code}
              </p>
              
              <h2>Your Product Mockup:</h2>
              <img src="${mockupUrl}" alt="Product Mockup" class="mockup-image">
              
              <p>If you have any questions about your order, please contact our support team at <a href="mailto:hello@canvasgenie.ai">hello@canvasgenie.ai</a>.</p>
            </div>
            <div class="footer">
              <p>Thank you for choosing CanvasGenie.ai!</p>
            </div>
          </div>
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