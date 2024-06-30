// components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import ProductVariantSelector from './ProductVariantSelector';
import GeneratedImageDisplay from './GeneratedImageDisplay';

const ProductDetails = ({ 
  product, 
  onVariantSelected, 
  selectedVariant, 
  generateMockup, 
  mockupUrl, 
  isGeneratingMockup, 
  handleBackToGrid,
  originalImageUrl,
  generatedImageUrl
}) => {
  const [error, setError] = useState('');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [localSelectedVariant, setLocalSelectedVariant] = useState(null);
  const [isMockupGenerated, setIsMockupGenerated] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('ProductDetails: Product changed', product);
    setError('');
    setLocalSelectedVariant(null);
    setIsMockupGenerated(false);
    setFeedbackMessage('');
  }, [product]);

  useEffect(() => {
    console.log('ProductDetails: Mockup URL changed', mockupUrl);
    setIsMockupGenerated(!!mockupUrl);
  }, [mockupUrl]);

  const handleVariantSelected = (variant) => {
    console.log('ProductDetails: Variant selected', variant);
    setLocalSelectedVariant(variant);
    onVariantSelected(variant);
  };

  const handleGenerateMockup = async () => {
    if (!localSelectedVariant) {
      setFeedbackMessage('Please select product options first.');
      return;
    }

    console.log('ProductDetails: Generating mockup', { product, localSelectedVariant });
    setError('');
    try {
      await generateMockup(product, localSelectedVariant);
      setIsMockupGenerated(true);
      setFeedbackMessage('');
    } catch (err) {
      console.error('ProductDetails: Mockup generation error:', err);
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
    console.log('ProductDetails: Image zoom', imageUrl);
    setZoomedImage(imageUrl);
  };

  const closeZoomedImage = () => {
    console.log('ProductDetails: Close zoomed image');
    setZoomedImage(null);
  };

  const handleDisabledButtonClick = () => {
    console.log('ProductDetails: Disabled button clicked');
    setFeedbackMessage('Please select product options first.');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg relative pb-24 md:pb-0">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBackToGrid}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Back to All Products
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
            isMobile={isMobile}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {feedbackMessage && <p className="text-yellow-500 text-sm mt-2">{feedbackMessage}</p>}
        </div>
      </div>
      
      {/* GeneratedImageDisplay component placed beneath the product details */}
      <div className="mt-8 mb-24 md:mb-0">
        <GeneratedImageDisplay imageUrl={generatedImageUrl} altText="Your generated artwork" />
      </div>

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeZoomedImage}>
          <div className="max-w-3xl max-h-3xl">
            <img src={zoomedImage} alt="Zoomed product" className="max-w-full max-h-full" />
          </div>
        </div>
      )}

      {/* Sticky footer for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex w-3/4 md:w-96 lg:w-96 mx-auto flex-col space-y-2">
          <button
            onClick={localSelectedVariant ? handleGenerateMockup : handleDisabledButtonClick}
            className={`w-full ${
              isGeneratingMockup || isMockupGenerated || !localSelectedVariant
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white px-4 py-2 rounded-lg transition-colors`}
          >
            {isGeneratingMockup ? 'Generating...' : isMockupGenerated ? 'Mockup Generated' : 'Generate Mockup'}
          </button>
          {feedbackMessage && <p className="text-yellow-500 text-sm mt-2">{feedbackMessage}</p>}
          <CheckoutButton
            product={{
              id: product.id,
              name: product.title,
            }}
            variant={localSelectedVariant && {
              id: localSelectedVariant.id,
              name: `${localSelectedVariant.color} - ${localSelectedVariant.size}`,
              price: localSelectedVariant.sellingPrice
            }}
            imageUrl={mockupUrl}
            originalImageUrl={originalImageUrl}
            isMockupGenerated={isMockupGenerated}
            setFeedbackMessage={setFeedbackMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
