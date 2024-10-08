// pages/support.js
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';


const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Support - CanvasGenie.ai</title>
        <meta name="description" content="Get support for CanvasGenie.ai" />
      </Head>
      
      <Header />

      <main className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-8">Support</h2>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <p className="text-lg mb-6">
              We&apos;re here to help! If you have any questions, issues, or feedback about CanvasGenie.ai, please don&apos;t hesitate to reach out to us.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <p className="mb-2">
              Email: <a href="mailto:hello@canvasgenie.ai" className="text-purple-400 hover:text-purple-300">hello@canvasgenie.ai</a>
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Q: How long does it take to receive my order?</h4>
                <p>A: Shipping times may vary depending on your location and the product ordered. Typically, orders are processed within 2-3 business days, and shipping can take an additional 3-7 business days.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Q: Can I modify my order after it&apos;s been placed?</h4>
                <p>A: Due to our automated production process, we&apos;re unable to modify orders once they&apos;ve been placed. If you need to make changes, please contact us as soon as possible, and we&apos;ll do our best to assist you.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Q: What if I&apos;m not satisfied with my order?</h4>
                <p>A: Your satisfaction is our top priority. If you&apos;re not happy with your order, please contact us within 14 days of receiving your item, and we&apos;ll work with you to make it right.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;