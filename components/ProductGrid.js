import React from 'react';

const ProductGrid = ({ 
  products, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onProductSelect, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  isLoading
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (isLoading) {
    return <div className="text-white text-center">Loading products...</div>;
  }

  if (displayedItems.length === 0) {
    return <div className="text-white text-center">No products found in this category.</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="product-category" className="block text-sm font-medium text-gray-300 mb-2">
          Filter by Category
        </label>
        <select
          id="product-category"
          value={selectedCategory}
          onChange={onCategoryChange}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4 shadow-lg transition-transform hover:scale-105">
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <img
                src={item.thumbnail_url || item.image || '/placeholder-image.jpg'}
                alt={`${item.title} preview`}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300 mb-4">
              {item.variant_count} variants available
            </p>
            <button
              onClick={() => onProductSelect(item)}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
    </div>
  );
};

export default ProductGrid;