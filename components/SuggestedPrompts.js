import React from 'react';

const SuggestedPrompts = ({ onPromptClick }) => {
  const prompts = [
    "Abstract modern minimalist art",
    "Cyberpunk city with neon lights and flying cars",
    "Surreal landscape with floating islands and waterfalls",
    "Steampunk-inspired clockwork butterfly"
  ];

  return (
    <div className="mt-8 mb-12">
      <h3 className="text-xl font-semibold text-center text-white mb-4">Need inspiration? Try these prompts:</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;