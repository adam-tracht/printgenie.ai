// pages/api/check-env.js
export default function handler(req, res) {
    console.log('All environment variables:', process.env);
    console.log('PRINTFUL_ACCESS_TOKEN:', process.env.PRINTFUL_ACCESS_TOKEN ? 'Set' : 'Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV);
  
    res.status(200).json({ 
      printfulTokenSet: !!process.env.PRINTFUL_ACCESS_TOKEN,
      nodeEnv: process.env.NODE_ENV
    });
  }