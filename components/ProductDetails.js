// components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import ProductVariantSelector from './ProductVariantSelector';

const ProductDetails = ({ 
  product, 
  onVariantSelected, 
  selectedVariant, 
  generateMockup, 
  mockupUrl, 
  isGeneratingMockup, 
  handleBackToGrid,
  originalImageUrl // Add this prop
}) => {
  const [error, setError] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [localSelectedVariant, setLocalSelectedVariant] = useState(null);
  const [isMockupGenerated, setIsMockupGenerated] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    setError('');
    setLocalSelectedVariant(null);
    setIsMockupGenerated(false);
    setFeedbackMessage('');
  }, [product]);

  useEffect(() => {
    setIsMockupGenerated(!!mockupUrl);
  }, [mockupUrl]);

  const handleVariantSelected = (variant) => {
    setLocalSelectedVariant(variant);
    onVariantSelected(variant);
  };

  const handleGenerateMockup = async (product, variant) => {
    setError('');
    try {
      await generateMockup(product, variant);
      setIsMockupGenerated(true);
      setFeedbackMessage('');
    } catch (err) {
      console.error('Mockup generation error:', err);
      setError('Unable to generate mockup. Please try another product or contact support.');
      setIsMockupGenerated(false);
    }
  };

  const getFirstSentence = (description) => {
    if (!description) return "No description available.";
    const match = description.match(/^.*?[.!?](?:\s|$)/);
    return match ? match[0].trim() : description.slice(0, 100).trim() + '...';
  };

  const handleImageZoom = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  const handleDisabledButtonClick = () => {
    setFeedbackMessage('Please generate a live preview before proceeding to checkout.');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBackToGrid}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Back to All Products
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="relative aspect-w-1 aspect-h-1">
            <img 
              src={mockupUrl || (localSelectedVariant && localSelectedVariant.image) || product.thumbnail_url || product.image || '/placeholder-image.jpg'} 
              alt={product.title} 
              className="object-cover w-full h-full rounded-lg"
            />
            <button 
              className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
              onClick={() => handleImageZoom(mockupUrl || (localSelectedVariant && localSelectedVariant.image) || product.thumbnail_url || product.image)}
            >
              <ZoomIn size={20} />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white">{product.title}</h3>
            <p className="text-gray-300 text-sm">
              {getFirstSentence(product.description)}
            </p>
          </div>
          
          <ProductVariantSelector
            product={product}
            onVariantSelected={handleVariantSelected}
            generateMockup={handleGenerateMockup}
            isGeneratingMockup={isGeneratingMockup}
            isMockupGenerated={isMockupGenerated}
            onDisabledCheckoutClick={handleDisabledButtonClick}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {localSelectedVariant && (
            <div>
              {isMockupGenerated ? (
                <CheckoutButton
                  product={{
                    id: product.id,
                    name: product.title,
                  }}
                  variant={{
                    id: localSelectedVariant.id,
                    name: `${localSelectedVariant.color} - ${localSelectedVariant.size}`,
                    price: localSelectedVariant.sellingPrice
                  }}
                  imageUrl={mockupUrl}
                  originalImageUrl={originalImageUrl} // Use the prop here
                />
              ) : (
                <button
                  onClick={handleDisabledButtonClick}
                  className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          )}
          
          {feedbackMessage && <p className="text-yellow-500 text-sm mt-2">{feedbackMessage}</p>}
        </div>
      </div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeZoomedImage}>
          <div className="max-w-3xl max-h-3xl">
            <img src={zoomedImage} alt="Zoomed product" className="max-w-full max-h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;