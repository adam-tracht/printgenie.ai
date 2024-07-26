// components/StyleSelector.js
import React from 'react';
import Image from 'next/image';

const StyleSelector = ({ styles, onStyleSelect, disabled }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {styles.map((style, index) => (
        <div
          key={index}
          className={`bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => !disabled && onStyleSelect(style.content)}
        >
          <div className="relative h-32">
            <Image
              src={style.image}
              alt={style.content}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-2 text-center">
            <p className="text-sm text-gray-300">{style.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StyleSelector;