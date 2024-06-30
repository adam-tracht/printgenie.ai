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
    <h1 className="text-4xl font-extrabold text-white mb-4">
      Transform Your Ideas into Custom Wall Art
    </h1>
    <p className="md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
      CanvasGenie.ai uses advanced AI to turn your text descriptions into unique, 
      high-quality artwork. Create personalized prints, canvases, shirts and more!
    </p>
  </div>
);

const steps = [
  { title: 'Describe Your Vision'},
  { title: 'Choose Your Canvas'},
  { title: 'Preview and Checkout'}
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
    setCurrentStep(currentStep - 1);
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
                    name: `${selectedProduct.title} - ${selectedVariant.name}`,
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl">
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

      {/* Main content area */}
      <div className="transition-opacity duration-300">
        {renderStep()}
      </div>

      {/* Back button */}
      <div className="mt-8 flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="mr-2" />
            {currentStep === 1 ? 'Back to Image Generation' : 'Back to Product Selection'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MainAppFlow;