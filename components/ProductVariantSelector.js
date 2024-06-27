// components/ProductVariantSelector.js
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import VariantSelector from './VariantSelector';

// Function to calculate the selling price with profit margin
const calculateSellingPrice = (basePrice) => {
  const priceWithMargin = basePrice * 1.2; // Add 20% profit margin
  const roundedPrice = Math.floor(priceWithMargin) + 0.95; // Round down to nearest whole number and add 0.95
  return parseFloat(roundedPrice.toFixed(2)); // Ensure we return a number with 2 decimal places
};

const ProductVariantSelector = ({ 
  product, 
  onVariantSelected, 
  generateMockup, 
  isGeneratingMockup,
  isMockupGenerated,
  onDisabledCheckoutClick
}) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [localSelectedVariant, setLocalSelectedVariant] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    setSelectedColor('');
    setSelectedSize('');
    setLocalSelectedVariant(null);
    setFeedbackMessage('');
  }, [product]);

  const getUniqueOptions = () => {
    const colorVariants = new Map();
    const sizes = new Set();
    product.variants.forEach(variant => {
      if (!colorVariants.has(variant.color)) {
        colorVariants.set(variant.color, variant);
      }
      sizes.add(variant.size);
    });
    return { 
      colorVariants: Array.from(colorVariants.values()),
      sizes: sortSizes(Array.from(sizes))
    };
  };

  const sortSizes = (sizes) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    return sizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  };

  const { colorVariants, sizes } = getUniqueOptions();

  const handleColorChange = (color) => {
    setSelectedColor(color);
    updateSelectedVariant(color, selectedSize || sizes[0]);
    setFeedbackMessage('');
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    updateSelectedVariant(selectedColor, size);
    setFeedbackMessage('');
  };

  const updateSelectedVariant = (color, size) => {
    const variant = product.variants.find(v => v.color === color && v.size === size);
    if (variant) {
      const sellingPrice = calculateSellingPrice(variant.price);
      const updatedVariant = { ...variant, sellingPrice };
      setLocalSelectedVariant(updatedVariant);
      onVariantSelected(updatedVariant);
    }
  };

  const handlePreviewClick = () => {
    if (!selectedColor || !selectedSize) {
      setFeedbackMessage('Please select both color and size options first.');
    } else {
      generateMockup(product, localSelectedVariant);
    }
  };

  const isSizeOutOfStock = (size) => {
    const variant = product.variants.find(v => v.size === size && v.color === selectedColor);
    return variant && variant.in_stock === false;
  };

  return (
    <div className="space-y-4">
      <VariantSelector
        colorVariants={colorVariants}
        sizes={sizes}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        handleColorChange={handleColorChange}
        handleSizeChange={handleSizeChange}
        isSizeOutOfStock={isSizeOutOfStock}
      />

      {localSelectedVariant && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-1">Price</h4>
          <p className="text-2xl font-bold text-purple-400">${localSelectedVariant.sellingPrice.toFixed(2)}</p>
        </div>
      )}

      <button
        onClick={handlePreviewClick}
        disabled={isGeneratingMockup}
        className={`w-full ${
          isGeneratingMockup
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gray-700 hover:bg-gray-600'
        } text-white px-4 py-2 rounded-lg transition-colors`}
      >
        {isGeneratingMockup ? (
          <>
            <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Live Preview'
        )}
      </button>
      
      {feedbackMessage && <p className="text-yellow-500 text-sm mt-2">{feedbackMessage}</p>}
    </div>
  );
};

export default ProductVariantSelector;