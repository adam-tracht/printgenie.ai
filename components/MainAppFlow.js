// components/MainAppFlow.js
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import DalleIntegration from './DalleIntegration';
import ProductSelection from './ProductSelection';
import CheckoutButton from './CheckoutButton';
import SuggestedPrompts from './SuggestedPrompts';

// Enhanced Hero component with more descriptive content
const Hero = () => (
  <div className="text-center mb-8">
    <h1 className="text-2xl font-extrabold text-white mb-4">
      Transform Your Ideas into Custom Wall Art
    </h1>
    <p className="md:text-lg text-gray-300 max-w-3xl mx-auto mb-6">
      CanvasGenie.ai uses AI to turn your descriptions into one-of-a-kind physical artwork. Create unique prints, canvases, shirts and more!
    </p>
  </div>
);

const steps = [
  { title: 'Describe Your Vision', description: 'Use AI to generate your custom artwork' },
  { title: 'Choose Your Canvas', description: 'Select the perfect product for your art' },
  { title: 'Preview and Checkout', description: 'Review your creation and complete your order' }
];

const MainAppFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mockupImage, setMockupImage] = useState(null);
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleImageGenerated = (imageUrl) => {
    console.log('Image generated:', imageUrl);
    setGeneratedImage(imageUrl);
    setOriginalImageUrl(imageUrl);
    setCurrentStep(1);
  };

  const handleProductSelected = (product) => {
    console.log("Product selected in MainAppFlow:", product);
    setSelectedProduct(product);
  };

  const handleVariantSelected = (variant) => {
    console.log("Variant selected in MainAppFlow:", variant);
    setSelectedVariant(variant);
  };

  const handleMockupGenerated = (mockupUrl) => {
    console.log("Mockup generated in MainAppFlow:", mockupUrl);
    setMockupImage(mockupUrl);
    setIsGeneratingMockup(false);
  };

  const handleCheckout = () => {
    setCurrentStep(2);
  };

  const handlePromptClick = (newPrompt) => {
    setPrompt(newPrompt);
  };

  const handleBack = () => {
    if (currentStep === 1 && selectedProduct) {
      // If a product is selected, go back to product grid
      setSelectedProduct(null);
      setSelectedVariant(null);
      setMockupImage(null);
    } else {
      // Otherwise, go back to the previous step
      setCurrentStep(currentStep - 1);
    }
  };

  const renderBackButton = () => {
    if (currentStep === 0) return null;

    let buttonText = 'Back to Image Generation';
    if (currentStep === 1) {
      buttonText = selectedProduct ? 'Back to All Products' : 'Back to Image Generation';
    } else if (currentStep === 2) {
      buttonText = 'Back to Product Selection';
    }

    return (
      <button
        onClick={handleBack}
        className="flex items-center text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg shadow-md"
      >
        <ChevronLeft className="mr-2" size={20} />
        {buttonText}
      </button>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Hero />
            <DalleIntegration onImageGenerated={handleImageGenerated} initialPrompt={prompt} />
            <SuggestedPrompts onPromptClick={handlePromptClick} />
          </>
        );
      case 1:
        return (
          <ProductSelection 
            image={generatedImage}
            originalImageUrl={originalImageUrl}
            onProductSelected={handleProductSelected}
            onVariantSelected={handleVariantSelected}
            selectedProduct={selectedProduct}
            onMockupGenerated={handleMockupGenerated}
            isGeneratingMockup={isGeneratingMockup}
            setIsGeneratingMockup={setIsGeneratingMockup}
            onCheckout={handleCheckout}
          />
        );
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Preview and Checkout</h2>
            {mockupImage ? (
              <img src={mockupImage} alt="Product Mockup" className="w-64 h-64 mx-auto mb-4 rounded-lg shadow-lg" />
            ) : (
              <div className="w-64 h-64 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-white">Mockup not available</p>
              </div>
            )}
            {selectedProduct && selectedVariant && (
              <>
                <p className="text-lg text-gray-300 mb-4">Product: {selectedProduct.title}</p>
                <p className="text-lg text-gray-300 mb-4">Variant: {selectedVariant.name}</p>
                <p className="text-xl text-white mb-6">Price: ${selectedVariant.price}</p>
                <CheckoutButton 
                  product={{
                    id: selectedProduct.id,
                    name: `${selectedProduct.title} - ${selectedVariant.name}`,
                  }}
                  variant={{
                    id: selectedVariant.id,
                    price: selectedVariant.price
                  }}
                  imageUrl={mockupImage}
                  originalImageUrl={originalImageUrl}
                />
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-purple-500' : 'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                index <= currentStep ? 'border-purple-500' : 'border-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="mt-2 text-xs font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
            <div style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mb-6">
        {renderBackButton()}
      </div>

      {/* Main content area */}
      <div className="transition-opacity duration-300">
        {renderStep()}
      </div>
    </div>
  );
};

export default MainAppFlow;