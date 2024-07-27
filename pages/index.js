// pages/index.js
import React from 'react';
import Head from 'next/head';
import ErrorBoundary from '../components/ErrorBoundary';
import MainAppFlow from '../components/MainAppFlow';
import Header from '../components/Header';
import { ArrowRight, Zap, Palette, Image as ImageIcon, ShoppingCart } from 'lucide-react';

const HomePage = () => {
  // Define the steps of the CanvasGenie.ai process
  const steps = [
    { icon: <Palette className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />, title: "Describe Your Vision", description: "Use natural language to tell our AI what you want to create." },
    { icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />, title: "AI Generates Your Art", description: "Our advanced AI interprets your description and creates a unique image." },
    { icon: <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />, title: "Choose Your Product", description: "Select from a variety of high-quality print products to showcase your art." },
    { icon: <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />, title: "Order and Enjoy", description: "Place your order and receive your one-of-a-kind AI-generated artwork." },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>CanvasGenie.ai | AI-Generated Artwork and Custom Prints</title>
        <meta name="description" content="Create unique, AI-generated artwork and order custom prints with CanvasGenie.ai. Transform your ideas into stunning visual art pieces." />
        <meta name="keywords" content="AI art, custom prints, AI-generated artwork, digital art creation, personalized artwork" />
        <meta property="og:title" content="CanvasGenie.ai | AI-Generated Artwork and Custom Prints" />
        <meta property="og:description" content="Transform your ideas into stunning visual art with CanvasGenie.ai&apos;s AI-powered custom art creation platform." />
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
        <div id="about-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-2xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 md:mb-6">
              About CanvasGenie: AI-Powered Art Creation
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
              Empowering creativity through advanced AI art generation and high-quality custom prints
            </p>
          </section>
          
          <section className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4 md:mb-6">Our Vision: Democratizing Digital Art Creation</h3>
            <div className="bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg">
              <p className="text-sm md:text-base text-gray-300 mb-4">
                At CanvasGenie.ai, we believe that everyone has a unique artistic vision waiting to be brought to life. Our mission is to democratize art creation by combining cutting-edge AI technology with high-quality print-on-demand services.
              </p>
              <p className="text-sm md:text-base text-gray-300">
                We&apos;re making it possible for anyone, regardless of artistic background, to transform their ideas into stunning, tangible artwork. With CanvasGenie.ai, the only limit is your imagination.
              </p>
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4 md:mb-6">How CanvasGenie.ai Works: From Idea to Custom Print</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {steps.map((step, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg flex flex-col items-center text-center">
                  {step.icon}
                  <h4 className="text-lg md:text-xl font-semibold text-white mt-3 md:mt-4 mb-2">{step.title}</h4>
                  <p className="text-sm md:text-base text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4 md:mb-6">Our Commitment to AI-Powered Art Excellence</h3>
            <div className="bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg">
              <p className="text-sm md:text-base text-gray-300 mb-4">
                We are committed to providing a seamless, user-friendly experience that empowers creativity. Our team continually works to:
              </p>
              <ul className="list-disc list-inside text-sm md:text-base text-gray-300 space-y-2 mb-4">
                <li>Improve our AI algorithms for more accurate and diverse art generation</li>
                <li>Expand our product offerings to give you more ways to showcase your AI-created art</li>
                <li>Ensure the highest quality in every custom print we deliver</li>
                <li>Provide excellent customer support throughout your creative journey with AI</li>
              </ul>
              <p className="text-sm md:text-base text-gray-300">
                Your satisfaction and creative expression are at the heart of everything we do at CanvasGenie.ai.
              </p>
            </div>
          </section>

          <section className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4 md:mb-6">Join the AI Art Revolution with CanvasGenie.ai</h3>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8">
              Whether you&apos;re an art enthusiast, a creative professional, or someone who&apos;s always wanted to create but never knew where to start, CanvasGenie.ai is here to help you bring your imagination to life. Join us in exploring the endless possibilities of AI-powered art creation.
            </p>
            <a href="#top" className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors text-base md:text-lg font-semibold">
              Start Creating Your AI Art Now
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </a>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;