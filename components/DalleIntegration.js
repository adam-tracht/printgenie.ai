// components/DalleIntegration.js
import React, { useState, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';

const DalleIntegration = ({ onImageGenerated, initialPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      generateImage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    let intervalId;
    if (jobId) {
      intervalId = setInterval(checkJobStatus, 2000); // Check every 2 seconds
    }
    return () => clearInterval(intervalId);
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateImage(prompt);
  };

  const generateImage = async (currentPrompt) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    
    if (currentPrompt.toLowerCase() === 'test') {
      // Use a placeholder image for testing
      const placeholderImage = 'https://via.placeholder.com/512x512.png?text=Test+Image';
      setGeneratedImageUrl(placeholderImage);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt, action: 'start' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start image generation');
      }

      const data = await response.json();
      setJobId(data.jobId);
    } catch (error) {
      console.error('Error starting image generation:', error);
      setError('Failed to start image generation. Please try again.');
      setIsLoading(false);
    }
  };

  const checkJobStatus = async () => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, action: 'status' }),
      });

      if (!response.ok) {
        throw new Error('Failed to check job status');
      }

      const data = await response.json();
      if (data.status === 'completed') {
        setGeneratedImageUrl(data.imageUrl);
        setIsLoading(false);
        setJobId(null);
      } else if (data.status === 'failed') {
        setError('Image generation failed. Please try again.');
        setIsLoading(false);
        setJobId(null);
      }
    } catch (error) {
      console.error('Error checking job status:', error);
      setError('Failed to check job status. Please try again.');
      setIsLoading(false);
      setJobId(null);
    }
  };

  const handleRegenerateImage = () => {
    generateImage(prompt);
  };

  const handleConfirmImage = () => {
    onImageGenerated(generatedImageUrl);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Create Your AI Artwork</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your artwork or enter 'test' for a placeholder"
            className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      {generatedImageUrl && (
        <div className="mt-6 md:w-3/4 md:h-3/4 mx-auto">
          <img src={generatedImageUrl} alt="Generated artwork" className="w-full rounded-lg shadow-lg mb-4" />
          <div className="flex justify-between">
            <button
              onClick={handleRegenerateImage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Regenerate
            </button>
            <button
              onClick={handleConfirmImage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DalleIntegration;