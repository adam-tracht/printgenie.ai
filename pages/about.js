import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>About CanvasGenie.ai - AI-Powered Custom Art Creation</title>
        <meta name="description" content="Learn about CanvasGenie.ai, your AI-powered custom art creation platform. Discover how we blend cutting-edge AI technology with print-on-demand to bring your unique visions to life." />
        <meta name="keywords" content="CanvasGenie.ai, AI art, custom prints, about us, AI-powered art, print on demand" />
        <meta property="og:title" content="About CanvasGenie.ai - AI-Powered Custom Art Creation" />
        <meta property="og:description" content="Discover the story behind CanvasGenie.ai and our mission to revolutionize custom art creation with AI technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://canvasgenie.ai/about" />
        <meta property="og:image" content="https://canvasgenie.ai/images/og-image.jpg" /> {/* Make sure to add an appropriate OG image */}
        <link rel="canonical" href="https://canvasgenie.ai/about" />
      </Head>

      <Header />

      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white mb-8">About CanvasGenie.ai</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Vision</h2>
            <p className="text-gray-300 mb-4">
              At CanvasGenie.ai, we believe that everyone has a unique artistic vision waiting to be brought to life. Our mission is to democratize art creation by combining cutting-edge AI technology with high-quality print-on-demand services, making it possible for anyone to transform their ideas into stunning, tangible artwork.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Describe your vision: Use natural language to tell our AI what you want to create.</li>
              <li>AI generates your art: Our advanced AI interprets your description and creates a unique image.</li>
              <li>Choose your product: Select from a variety of high-quality print products to showcase your art.</li>
              <li>Preview and customize: See a realistic mockup of your product and make any final adjustments.</li>
              <li>Order and enjoy: Place your order and receive your one-of-a-kind AI-generated artwork.</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Commitment</h2>
            <p className="text-gray-300 mb-4">
              We are committed to providing a seamless, user-friendly experience that empowers creativity. Our team continually works to improve our AI algorithms, expand our product offerings, and ensure the highest quality in every print we deliver.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Join Us in Reimagining Art</h2>
            <p className="text-gray-300 mb-4">
              Whether you're an art enthusiast, a creative professional, or someone who's always wanted to create but never knew where to start, CanvasGenie.ai is here to help you bring your imagination to life. Join us in exploring the endless possibilities of AI-powered art creation.
            </p>
            <Link href="/" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Start Creating Now
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;