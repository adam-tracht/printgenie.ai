//components/VariantSelector.js
import React from 'react';

const VariantSelector = ({ 
  colorVariants = [], 
  sizes = [], 
  selectedColor, 
  selectedSize, 
  handleColorChange, 
  handleSizeChange, 
  isSizeOutOfStock 
}) => {
  console.log('VariantSelector: Props received', {
    colorVariantsLength: colorVariants.length,
    sizesLength: sizes.length,
    selectedColor,
    selectedSize
  });

  return (
    <div>
      {colorVariants.length > 1 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-2">Select Color</h4>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleColorChange(variant.color || 'default')}
                className={`w-10 h-10 rounded-full border-2 overflow-hidden ${
                  selectedColor === (variant.color || 'default')
                    ? 'border-purple-600'
                    : 'border-gray-600'
                }`}
                title={variant.color || 'Default'}
              >
                <img 
                  src={variant.image || '/placeholder-image.jpg'} 
                  alt={variant.color || 'Default'}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Select Size</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                disabled={isSizeOutOfStock(size)}
                className={`px-3 py-1 rounded ${
                  selectedSize === size
                    ? 'bg-purple-600 text-white'
                    : isSizeOutOfStock(size)
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } transition-colors`}
              >
                {size}
                {isSizeOutOfStock(size) && <span className="ml-1 text-red-500">*</span>}
              </button>
            ))}
          </div>
          {sizes.some(isSizeOutOfStock) && (
            <p className="text-red-500 text-xs mt-1">* Out of stock</p>
          )}
        </div>
      )}

      {colorVariants.length === 0 && sizes.length === 0 && (
        <p className="text-yellow-500">No variant options available for this product.</p>
      )}
    </div>
  );
};

export default VariantSelector;