//components/ProductSelection.js
import React, { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import ProductDetails from './ProductDetails';

const ProductSelection = ({ image, originalImageUrl, onProductSelected, onVariantSelected, selectedProduct, onMockupGenerated, isGeneratingMockup, setIsGeneratingMockup }) => {
  const [catalogItems, setCatalogItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelectedProduct, setLocalSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mockupUrl, setMockupUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showGrid, setShowGrid] = useState(true);

  // Allowed categories in the desired order
  const allowedCategories = [
    "Canvas (in)",
    "Framed Canvas (in)",
    "Enhanced Matte Paper Poster (in)",
    "Enhanced Matte Paper Framed Poster (in)",
    "Framed Poster With Mat (cm)",
    "T-Shirt"
  ];

  useEffect(() => {
    const fetchCatalogItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('ProductSelection: Fetching catalog items');
        const response = await fetch('/api/printful', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'getCatalogItems' }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch catalog items');
        }

        const data = await response.json();
        console.log('ProductSelection: Received catalog items:', data.result.length);

        const filteredProducts = data.result.filter(item => 
          !item.is_discontinued && allowedCategories.includes(item.type_name)
        );
        
        // Sort products based on the order of allowedCategories
        const sortedProducts = filteredProducts.sort((a, b) => {
          return allowedCategories.indexOf(a.type_name) - allowedCategories.indexOf(b.type_name);
        });

        const categorizedProducts = sortedProducts.map(product => ({
          ...product,
          category: product.type_name,
        }));
        
        if (categorizedProducts.length === 0) {
          throw new Error('No active products found in the specified categories.');
        }
        
        console.log('ProductSelection: Filtered and sorted products:', categorizedProducts.length);
        setCatalogItems(categorizedProducts);
      } catch (error) {
        console.error('ProductSelection: Error fetching catalog items:', error);
        setError(error.message || 'Failed to load catalog items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogItems();
  }, []);

  useEffect(() => {
    console.log('ProductSelection: selectedProduct updated:', selectedProduct);
    setLocalSelectedProduct(selectedProduct);
    if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
      const initialVariant = selectedProduct.variants[0];
      console.log('ProductSelection: Setting initial variant:', initialVariant);
      setSelectedVariant(initialVariant);
      setMockupUrl(null);
      setShowGrid(false);
    } else {
      // Reset state when selectedProduct becomes null
      setLocalSelectedProduct(null);
      setSelectedVariant(null);
      setMockupUrl(null);
      setShowGrid(true);
    }
  }, [selectedProduct]);

  const fetchProductVariants = async (productId) => {
    setIsLoading(true);
    try {
      console.log('ProductSelection: Fetching product variants for product ID:', productId);
      const response = await fetch('/api/printful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getProductDetails',
          data: { productId }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product variants');
      }

      const data = await response.json();
      console.log('ProductSelection: Fetched product details:', data.result);
      console.log('ProductSelection: Fetched variants:', data.result.variants);
      return data.result.variants;
    } catch (error) {
      console.error('ProductSelection: Error fetching product variants:', error);
      setError('Failed to load product variants. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = async (product) => {
    console.log('ProductSelection: Product selected:', product);
    setIsLoading(true);
    const variants = await fetchProductVariants(product.id);
    const updatedProduct = { ...product, variants };
    console.log('ProductSelection: Updated product with variants:', updatedProduct);
    setLocalSelectedProduct(updatedProduct);
    onProductSelected(updatedProduct);
    setSelectedVariant(null);
    setMockupUrl(null);
    setIsLoading(false);
    setShowGrid(false);
  };

  const handleVariantSelect = (variant) => {
    console.log('ProductSelection: Variant selected:', variant);
    setSelectedVariant(variant);
    onVariantSelected(variant);
    setMockupUrl(null);
  };

  const generateMockup = async (product, variant) => {
    if (!product || !variant) {
      console.error('ProductSelection: No product or variant selected');
      return;
    }

    console.log('ProductSelection: Generating mockup for product:', product, 'and variant:', variant);
    setIsGeneratingMockup(true);
    try {
      const response = await fetch('/api/printful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateMockup',
          data: {
            productId: product.id,
            variantId: variant.id,
            image_url: image,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate mockup: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('ProductSelection: Mockup generation task created:', data);

      // Poll for mockup result
      const pollMockupResult = async (taskKey) => {
        try {
          const resultResponse = await fetch('/api/printful', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'getMockupResult',
              data: { task_key: taskKey }
            }),
          });

          if (!resultResponse.ok) {
            const errorData = await resultResponse.json();
            throw new Error(`Failed to get mockup result: ${errorData.error || 'Unknown error'}`);
          }

          const resultData = await resultResponse.json();
          console.log('ProductSelection: Mockup generation status:', resultData.result.status);

          if (resultData.result.status === 'completed') {
            console.log('ProductSelection: Mockup generated:', resultData.result.mockups[0].mockup_url);
            setMockupUrl(resultData.result.mockups[0].mockup_url);
            setIsGeneratingMockup(false);
            onMockupGenerated(resultData.result.mockups[0].mockup_url);
          } else if (resultData.result.status === 'failed') {
            throw new Error('Mockup generation failed');
          } else {
            setTimeout(() => pollMockupResult(taskKey), 1000);
          }
        } catch (error) {
          console.error('ProductSelection: Error polling mockup result:', error);
          setIsGeneratingMockup(false);
          throw error;
        }
      };

      await pollMockupResult(data.result.task_key);
    } catch (error) {
      console.error('ProductSelection: Error generating mockup:', error);
      setIsGeneratingMockup(false);
      throw error;
    }
  };

  const handlePageChange = (newPage) => {
    console.log('ProductSelection: Page changed to:', newPage);
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div className="text-white">Loading product options...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Step 2: Choose Your Canvas</h2>
      <p className="text-white mb-6">Select an item on which to print your artwork.</p>
      {showGrid ? (
        <ProductGrid
          products={catalogItems}
          onProductSelect={handleProductSelect}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          generatedImageUrl={image} // Pass the generated image URL to ProductGrid
        />
      ) : (
        <ProductDetails
          product={localSelectedProduct}
          onVariantSelected={handleVariantSelect}
          selectedVariant={selectedVariant}
          generateMockup={generateMockup}
          mockupUrl={mockupUrl}
          isGeneratingMockup={isGeneratingMockup}
          originalImageUrl={originalImageUrl}
          generatedImageUrl={image} // Pass the generated image URL to ProductDetails
        />
      )}
    </div>
  );
};

export default ProductSelection;