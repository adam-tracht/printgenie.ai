//pages/api/printful.js
import axios from 'axios';
import NodeCache from 'node-cache';

const PRINTFUL_ACCESS_TOKEN = process.env.PRINTFUL_ACCESS_TOKEN;

const printfulApi = axios.create({
  baseURL: 'https://api.printful.com',
  headers: {
    'Authorization': `Bearer ${PRINTFUL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Method Not Allowed');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, data } = req.body;
  console.log('API Request:', { action, data });

  try {
    let response;
    let cacheKey;

    switch (action) {
      case 'getCatalogItems':
        cacheKey = 'catalog_items';
        response = cache.get(cacheKey);
        if (response) {
          console.log('Returning cached catalog items');
          return res.status(200).json(response);
        }
        response = await printfulApi.get('/products');
        cache.set(cacheKey, response.data);
        console.log(`Received ${response.data.result.length} catalog items`);
        return res.status(200).json(response.data);

      case 'getProductDetails':
        cacheKey = `product_${data.productId}`;
        response = cache.get(cacheKey);
        if (response) {
          console.log('Returning cached product details');
          return res.status(200).json(response);
        }
        response = await printfulApi.get(`/products/${data.productId}`);
        cache.set(cacheKey, response.data);
        console.log('Product details fetched');
        return res.status(200).json(response.data);

      case 'generateMockup':
        // Step 1: Fetch printfiles for the product
        const printfilesResponse = await printfulApi.get(`/mockup-generator/printfiles/${data.productId}`);
        const printfilesData = printfilesResponse.data.result;
        console.log('Printfiles data:', JSON.stringify(printfilesData, null, 2));

        // Step 2: Determine the correct printfile for the variant and placement
        const variantPrintfile = printfilesData.variant_printfiles.find(vp => vp.variant_id === data.variantId);
        if (!variantPrintfile) {
          throw new Error(`No printfile found for variant ${data.variantId}`);
        }

        const placement = Object.keys(variantPrintfile.placements)[0]; // Use the first available placement
        const printfileId = variantPrintfile.placements[placement];
        const printfile = printfilesData.printfiles.find(pf => pf.printfile_id === printfileId);

        if (!printfile) {
          throw new Error(`No printfile found for placement ${placement}`);
        }

        console.log('Selected placement:', placement);
        console.log('Selected printfile:', printfile);

        // Step 3: Calculate positions based on the printfile
        const position = {
          area_width: printfile.width,
          area_height: printfile.height,
          width: printfile.width,
          height: printfile.height,
          top: 0,
          left: 0
        };

        // Step 4: Create mockup generation task
        const mockupTaskResponse = await printfulApi.post(`/mockup-generator/create-task/${data.productId}`, {
          variant_ids: [data.variantId],
          format: 'jpg',
          files: [
            {
              placement: placement,
              image_url: data.image_url,
              position: position
            }
          ]
        });

        console.log('Mockup generation task created', mockupTaskResponse.data);
        return res.status(200).json(mockupTaskResponse.data);

      case 'getMockupResult':
        response = await printfulApi.get(`/mockup-generator/task?task_key=${data.task_key}`);
        console.log('Mockup generation result fetched', response.data);
        return res.status(200).json(response.data);

        case 'createOrder':
          response = await printfulApi.post('/orders', data);
          console.log('Order created:', response.data);
          return res.status(200).json(response.data);
  
        default:
          console.log('Invalid action');
          return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Printful API error:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error details:', error.response?.data);
      res.status(error.response?.status || 500).json({ 
        error: 'Error processing Printful request', 
        details: error.message,
        stack: error.stack,
        apiResponse: error.response?.data 
      });
    }
  }