// components/ProductGrid.js
import React from 'react';
import GeneratedImageDisplay from './GeneratedImageDisplay';

const ProductGrid = ({ 
  products, 
  onProductSelect, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  isLoading,
  generatedImageUrl,
  isDisabled
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Function to truncate product title at parentheses
  const truncateTitle = (title) => {
    const parenthesisIndex = title.indexOf('(');
    return parenthesisIndex !== -1 ? title.slice(0, parenthesisIndex).trim() : title;
  };

  if (isLoading) {
    return <div className="text-white text-center">Loading products...</div>;
  }

  if (displayedItems.length === 0) {
    return <div className="text-white text-center">No products found.</div>;
  }

  return (
    <div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {displayedItems.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-lg p-4 shadow-lg transition-transform hover:scale-105">
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <img
                src={item.thumbnail_url || item.image || '/placeholder-image.jpg'}
                alt={`${truncateTitle(item.title)} preview`}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            {/* Use the truncateTitle function for the product title */}
            <h3 className="text-lg font-semibold text-white mb-2">{truncateTitle(item.title)}</h3>
            <button
              onClick={() => onProductSelect(item)}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={isDisabled}
            >
              Select
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &larr; Previous
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next &rarr;
        </button>
      </div>
      <div className="my-8">
        <GeneratedImageDisplay imageUrl={generatedImageUrl} altText="Your generated artwork" />
      </div>
    </div>
  );
};

export default ProductGrid;