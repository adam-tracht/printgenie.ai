// components/GeneratedImageDisplay.js
import React from 'react';
import Image from 'next/image';

const GeneratedImageDisplay = ({ imageUrl, altText }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Your AI-Generated Artwork</h3>
            <p className="text-gray-300 mb-4">
              This is the unique artwork created based on your prompt. It&apos;s ready to be printed on your chosen product.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={altText || "Generated artwork"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImageDisplay;