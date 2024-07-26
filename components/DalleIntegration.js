// components/DalleIntegration.js
import React, { useState, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import ArtStyleSlider from './ArtStyleSlider';

const DalleIntegration = ({ onImageGenerated, initialPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [jobId, setJobId] = useState(null);

  const suggestedStyles = [
    { name: 'Abstract Minimalism', content: 'Abstract minimalist wall art with clean lines, simple shapes, and a muted color palette', image: '/images/gallery/minimalist.jpg' },
    { name: 'Bohemian Chic', content: 'Bohemian chic wall art featuring warm earthy tones, intricate patterns, and a mix of textures', image: '/images/gallery/bohemian.jpg' },
    { name: 'Neo-Expressionism', content: 'Neo-expressionist wall art with bold brushstrokes, vivid colors, and emotional intensity', image: '/images/gallery/neo-expressionism.jpg' },
    { name: 'Digital Surrealism', content: 'Digital surrealist blending dreamlike elements with hyper-realistic details', image: '/images/gallery/digital-surrealism.jpg' },
    { name: 'Modern Pop Art', content: 'Modern pop art with bright colors, bold outlines, and contemporary cultural references', image: '/images/gallery/modern-pop-art.jpg' },
    { name: 'Organic Textures', content: 'Organic textures inspired by nature, with flowing forms and subtle gradients', image: '/images/gallery/organic-textures.jpg' },
    { name: 'Desert Minimalism', content: 'Minimalist desert landscape wall art with muted earth tones and occasional pops of vibrant color, featuring simple geometric shapes and clean lines', image: '/images/gallery/desert-minimalist.jpg' },
    { name: 'Geometric Patterns', content: 'Wall art with intricate geometric patterns, precise lines, and a harmonious color scheme', image: '/images/gallery/geometric-patterns.jpg' }
  ];

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
    
    try {
      console.log('Generating image with prompt:', currentPrompt);
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt, action: 'start' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to start image generation: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Image generation started:', data);
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
      console.log('Job status:', data);

      if (data.status === 'completed') {
        setGeneratedImageUrl(data.imageUrl);
        setIsLoading(false);
        setJobId(null);
      } else if (data.status === 'failed') {
        setError('Image generation failed. Please try again.');
        setIsLoading(false);
        setJobId(null);
      }
      // If still processing, we'll check again in the next interval
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

  const handleStyleSelect = (selectedStyle) => {
    setPrompt(selectedStyle.content);
    generateImage(selectedStyle.content);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-gray-900 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Step 1: Create Your AI Artwork</h2>
      
      {(isLoading || generatedImageUrl) && (
        <div className="mb-6 relative aspect-square">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <RefreshCw className="w-12 h-12 animate-spin text-purple-500" />
            </div>
          ) : (
            <img src={generatedImageUrl} alt="Generated artwork" className="w-full h-full object-cover rounded-lg shadow-lg" />
          )}
        </div>
      )}

      {generatedImageUrl && (
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
          <button
            onClick={handleRegenerateImage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center transition-colors duration-200 ease-in-out text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Regenerate
          </button>
          <button
            onClick={handleConfirmImage}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ease-in-out text-sm sm:text-base"
          >
            Confirm & Continue
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Select a Style</h3>
        <ArtStyleSlider
          styles={suggestedStyles}
          onStyleSelect={handleStyleSelect}
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Or Write Your Own Prompt</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision"
              className="flex-grow px-3 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-3 py-2 rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center transition-colors duration-200 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
    </div>
  );
};

export default DalleIntegration;