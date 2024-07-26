// components/ArtStyleSlider.js
import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ArtStyleSlider = ({ styles, onStyleSelect, disabled }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(styles.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentStyles = styles.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4">
        {currentStyles.map((style, index) => (
          <div
            key={index}
            className={`bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => !disabled && onStyleSelect(style)}
          >
            <div className="relative aspect-square">
              <Image
                src={style.image}
                alt={style.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-2 text-center">
              <p className="text-sm font-semibold text-white">{style.name}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-2 text-white"
        onClick={prevPage}
        disabled={disabled}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-2 text-white"
        onClick={nextPage}
        disabled={disabled}
      >
        <ChevronRight size={24} />
      </button>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentPage ? 'bg-purple-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtStyleSlider;