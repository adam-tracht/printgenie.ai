import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Gallery from '../components/Gallery';
import Header from '../components/Header';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Gallery - CanvasGenie.ai | AI-Generated Artwork Showcase</title>
        <meta name="description" content="Explore our gallery of AI-generated artwork created with CanvasGenie.ai. Get inspired and see the possibilities of AI-powered custom art creation." />
        <meta name="keywords" content="CanvasGenie.ai, AI art gallery, custom prints, AI-generated artwork, art showcase" />
        <meta property="og:title" content="Gallery - CanvasGenie.ai | AI-Generated Artwork Showcase" />
        <meta property="og:description" content="Discover a world of AI-generated artwork in our CanvasGenie.ai gallery. Be inspired by the endless possibilities of AI-powered art creation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://canvasgenie.ai/gallery" />
        <meta property="og:image" content="https://canvasgenie.ai/images/og-image-gallery.jpg" /> {/* Make sure to add an appropriate OG image for the gallery */}
        <link rel="canonical" href="https://canvasgenie.ai/gallery" />
      </Head>

      <Header />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center">AI-Generated Artwork Gallery</h1>
          <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            Explore our collection of AI-generated artwork created with CanvasGenie.ai. Get inspired and see the endless possibilities of AI-powered custom art creation.
          </p>
          <Gallery />
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;