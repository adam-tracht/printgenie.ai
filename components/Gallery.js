// components/Gallery.js
import React, { useState } from 'react';
import Image from 'next/image';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { src: '/images/gallery/image1.jpg', alt: 'Gallery Image 1' },
    { src: '/images/gallery/image2.jpg', alt: 'Gallery Image 2' },
    { src: '/images/gallery/image3.jpg', alt: 'Gallery Image 3' },
    { src: '/images/gallery/image4.jpg', alt: 'Gallery Image 4' },
    { src: '/images/gallery/image5.jpg', alt: 'Gallery Image 5' },
    { src: '/images/gallery/image6.jpg', alt: 'Gallery Image 6' },
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white mb-8">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="cursor-pointer transition-transform duration-300 hover:scale-105 object-cover"
                onClick={() => openLightbox(image)}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeLightbox}>
          <div className="relative w-full h-full max-w-3xl max-h-3xl">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeLightbox}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;