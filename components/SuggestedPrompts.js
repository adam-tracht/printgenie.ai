import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SuggestedPrompts = ({ onPromptClick }) => {
  const suggestedItems = [
    {
      type: 'text',
      content: "Abstract modern minimalist art",
      image: '/images/gallery/image1.jpg'
    },
    {
      type: 'text',
      content: "Cyberpunk city with neon lights and flying cars",
      image: '/images/gallery/image2.jpg'
    },
    {
      type: 'text',
      content: "Steampunk-inspired clockwork butterfly",
      image: '/images/gallery/image3.jpg'
    },
    {
      type: 'text',
      content: "Miami vaporwave",
      image: '/images/gallery/image4.jpg'
    },
    {
      type: 'gallery',
      content: "Astronaut in front of a complex scene of swirling cosmos",
      image: '/images/gallery/image5.jpg'
    },
    {
      type: 'gallery',
      content: "Basquiat style art",
      image: '/images/gallery/image6.jpg'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + suggestedItems.length) % suggestedItems.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % suggestedItems.length
    );
  };

  const getVisibleItems = () => {
    return [
      ...suggestedItems.slice(currentIndex),
      ...suggestedItems.slice(0, currentIndex)
    ].slice(0, 3);
  };

  const handlePromptClick = (content) => {
    onPromptClick(content);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="mt-8 mb-12">
      <h3 className="text-xl font-semibold text-center text-white mb-4">Need inspiration? Try these:</h3>
      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4">
          {getVisibleItems().map((item, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
              <div className="relative aspect-square flex-grow">
                <Image
                  src={item.image}
                  alt={item.content}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <p className="text-sm text-gray-300 mb-2">
                  {item.type === 'gallery' ? 'Gallery Example:' : 'Suggested Prompt:'}
                </p>
                <button
                  onClick={() => handlePromptClick(item.content)}
                  className="w-full h-20 bg-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 mt-2 flex items-center justify-center"
                >
                  <span className="text-center">{item.content}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={goToPrevious}
          className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
          aria-label="Previous suggestion"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
          aria-label="Next suggestion"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default SuggestedPrompts;