// components/Gallery.js
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Updated gallery data structure to include prompts
  const galleryItems = [
    { 
      src: '/images/gallery/image1.jpg', 
      prompt: 'Abstract modern minimalist art'
    },
    { 
      src: '/images/gallery/image2.jpg', 
      prompt: 'Cyberpunk city with neon lights and flying cars'
    },
    { 
      src: '/images/gallery/image3.jpg', 
      prompt: 'Steampunk-inspired clockwork butterfly'
    },
    { 
      src: '/images/gallery/image4.jpg', 
      prompt: 'Miami vaporwave'
    },
    { 
      src: '/images/gallery/image5.jpg', 
      prompt: 'Astronaut in front of a complex scene of swirling cosmos'
    },
    { 
      src: '/images/gallery/image6.jpg', 
      prompt: 'Basquiat style art'
    },
  ];

  const openLightbox = (index) => {
    setSelectedImage(galleryItems[index]);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedImage(galleryItems[newIndex]);
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedImage(galleryItems[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <section className="py-16 bg-gray-800 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">AI-Generated Art Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              <div className="relative aspect-square overflow-hidden group">
                <Image
                  src={item.src}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => openLightbox(index)}
                    className="text-white bg-purple-600 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{item.alt}</h3>
                <p className="text-gray-300 text-sm">
                  Prompt: &quot;{item.prompt}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center p-4">
            <div className="relative w-full h-3/4">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">{selectedImage.alt}</h3>
              <p className="text-gray-300">Prompt: &quot;{selectedImage.prompt}&quot;</p>
            </div>
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              onClick={goToPrevious}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              onClick={goToNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;