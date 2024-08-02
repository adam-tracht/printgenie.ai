// components/ImageGenerationLoadingScreen.js
import React, { useState, useEffect } from 'react';
import { RefreshCw, Paintbrush, Zap, Image as ImageIcon } from 'lucide-react';

const LoadingStep = ({ icon, text, isActive, isCompleted }) => (
  <div className={`flex items-center space-x-2 ${isActive ? 'text-purple-500' : isCompleted ? 'text-white' : 'text-gray-400'}`}>
    {icon}
    <span>{text}</span>
    {isCompleted && <span className="text-green-500">✓</span>}
  </div>
);

const ImageGenerationLoadingScreen = ({ prompt }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [funFact, setFunFact] = useState('');

  const steps = [
    { icon: <Paintbrush className="w-5 h-5" />, text: 'Interpreting your prompt' },
    { icon: <Zap className="w-5 h-5" />, text: 'Generating image concepts' },
    { icon: <ImageIcon className="w-5 h-5" />, text: 'Refining and detailing' },
    { icon: <RefreshCw className="w-5 h-5" />, text: 'Finalizing your artwork' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep < steps.length - 1 ? prevStep + 1 : prevStep));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-4">

      <div className="flex flex-col md:flex-row justify-between">
        <div className="space-y-4 mb-6 md:mb-0 md:w-1/2">
          {steps.map((step, index) => (
            <LoadingStep
              key={index}
              icon={step.icon}
              text={step.text}
              isActive={index === currentStep}
              isCompleted={index < currentStep}
            />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center md:w-1/2">
          <RefreshCw className="w-16 h-16 animate-spin text-purple-500 mb-4" />
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationLoadingScreen;