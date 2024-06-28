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
    console.log('ProductVariantSelector: Product changed', product);
    console.log('ProductVariantSelector: Product variants', product.variants);
    setSelectedColor('');
    setSelectedSize('');
    setLocalSelectedVariant(null);
    setFeedbackMessage('');

    // Automatically select the first variant if there's only one
    if (product.variants && product.variants.length === 1) {
      const variant = product.variants[0];
      setSelectedColor(variant.color || 'default');
      setSelectedSize(variant.size);
      updateSelectedVariant(variant.color || 'default', variant.size);
    }
  }, [product]);

  const getUniqueOptions = () => {
    console.log('ProductVariantSelector: Getting unique options');
    const colorVariants = new Map();
    const sizes = new Set();
    if (product.variants) {
      product.variants.forEach(variant => {
        const color = variant.color || 'default';
        if (!colorVariants.has(color)) {
          colorVariants.set(color, variant);
        }
        if (variant.size) {
          sizes.add(variant.size);
        }
      });
    }
    console.log('ProductVariantSelector: Unique colors', Array.from(colorVariants.keys()));
    console.log('ProductVariantSelector: Unique sizes', Array.from(sizes));
    return { 
      colorVariants: Array.from(colorVariants.values()),
      sizes: sortSizes(Array.from(sizes))
    };
  };

  const sortSizes = (sizes) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    return sizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  };

  const { colorVariants, sizes } = getUniqueOptions();

  const handleColorChange = (color) => {
    console.log('ProductVariantSelector: Color changed', color);
    setSelectedColor(color);
    updateSelectedVariant(color, selectedSize || sizes[0]);
    setFeedbackMessage('');
  };

  const handleSizeChange = (size) => {
    console.log('ProductVariantSelector: Size changed', size);
    setSelectedSize(size);
    updateSelectedVariant(selectedColor || 'default', size);
    setFeedbackMessage('');
  };

  const updateSelectedVariant = (color, size) => {
    console.log('ProductVariantSelector: Updating selected variant', { color, size });
    const variant = product.variants.find(v => (v.color || 'default') === color && v.size === size);
    if (variant) {
      console.log('ProductVariantSelector: Found matching variant', variant);
      const sellingPrice = calculateSellingPrice(variant.price);
      const updatedVariant = { ...variant, sellingPrice };
      setLocalSelectedVariant(updatedVariant);
      onVariantSelected(updatedVariant);
    } else {
      console.log('ProductVariantSelector: No matching variant found');
    }
  };

  const handlePreviewClick = () => {
    console.log('ProductVariantSelector: Preview clicked', {
      selectedColor,
      selectedSize,
      product: JSON.stringify(product),
      localSelectedVariant: JSON.stringify(localSelectedVariant)
    });
    if (!selectedSize || (colorVariants.length > 1 && !selectedColor)) {
      console.log('ProductVariantSelector: Color or size not selected');
      setFeedbackMessage('Please select both color and size options first.');
    } else {
      console.log('ProductVariantSelector: Generating mockup', { product, localSelectedVariant });
      generateMockup(product, localSelectedVariant);
    }
  };

  const isSizeOutOfStock = (size) => {
    const variant = product.variants.find(v => v.size === size && (v.color || 'default') === (selectedColor || 'default'));
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