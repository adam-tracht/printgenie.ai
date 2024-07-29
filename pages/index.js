// pages/index.js
import React from 'react';
import Head from 'next/head';
import ErrorBoundary from '../components/ErrorBoundary';
import MainAppFlow from '../components/MainAppFlow';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>CanvasGenie.ai | AI-Generated Artwork and Custom Prints</title>
        <meta name="description" content="Create unique, AI-generated artwork and order custom prints with CanvasGenie.ai. Transform your ideas into stunning visual art pieces." />
        <meta name="keywords" content="AI art, custom prints, AI-generated artwork, digital art creation, personalized artwork" />
        <meta property="og:title" content="CanvasGenie.ai | AI-Generated Artwork and Custom Prints" />
        <meta property="og:description" content="Transform your ideas into stunning visual art with CanvasGenie.ai's AI-powered custom art creation platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://canvasgenie.ai" />
        <meta property="og:image" content="https://canvasgenie.ai/images/og-image.jpg" />
        <link rel="canonical" href="https://canvasgenie.ai" />
      </Head>
      <Header />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorBoundary>
            <MainAppFlow />
          </ErrorBoundary>
        </div>
        
        {/* About section added to the bottom of the homepage */}
        <AboutSection />
      </main>
    </div>
  );
};

export default HomePage;