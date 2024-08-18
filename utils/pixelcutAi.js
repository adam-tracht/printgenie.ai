// utils/pixelcutAi.js
const axios = require('axios');
const sizeOf = require('image-size');

const PIXELCUT_API_KEY = process.env.PIXELCUT_API_KEY;
const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45MB to be safe (Printful limit is 50MB)
const MAX_IMAGE_SIZE = 4096; // Maximum size in pixels (4096x4096)

async function checkFileSize(url) {
  try {
    const response = await axios.head(url);
    const fileSize = parseInt(response.headers['content-length'], 10);
    console.log(`File size: ${fileSize} bytes (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
    return fileSize;
  } catch (error) {
    console.error('Error checking file size:', error);
    throw error;
  }
}

async function upscaleImage(imageUrl, targetSize = 5400) {
  console.log(`Attempting to upscale image: ${imageUrl}`);

  const calculateScale = (currentSize, targetSize) => {
    const scale = Math.min(Math.ceil(targetSize / currentSize), 4);
    const newSize = currentSize * scale;
    return newSize > MAX_IMAGE_SIZE ? MAX_IMAGE_SIZE / currentSize : scale;
  };

  const performUpscale = async (url, scale) => {
    const data = JSON.stringify({
      "image_url": url,
      "scale": scale
    });

    const config = {
      method: 'post',
      url: 'https://api.developer.pixelcut.ai/v1/upscale',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'X-API-KEY': PIXELCUT_API_KEY
      },
      data: data
    };

    const response = await axios.request(config);
    console.log('Pixelcut AI API response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.result_url) {
      return response.data.result_url;
    } else {
      throw new Error('Unexpected response structure from Pixelcut AI API');
    }
  };

  try {
    const initialFileSize = await checkFileSize(imageUrl);
    console.log(`Initial file size: ${initialFileSize} bytes (${(initialFileSize / 1024 / 1024).toFixed(2)} MB)`);

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data);
    
    const dimensions = sizeOf(buffer);
    if (!dimensions || !dimensions.width || !dimensions.height) {
      throw new Error('Invalid image dimensions');
    }
    
    let currentSize = Math.max(dimensions.width, dimensions.height);
    let currentUrl = imageUrl;

    console.log(`Initial image dimensions: ${dimensions.width}x${dimensions.height}`);

    while (currentSize < targetSize && currentSize < MAX_IMAGE_SIZE) {
      const scale = calculateScale(currentSize, targetSize);
      console.log(`Attempting to upscale from ${currentSize} to ${Math.min(currentSize * scale, MAX_IMAGE_SIZE)}`);
      
      const newUrl = await performUpscale(currentUrl, scale);
      const fileSize = await checkFileSize(newUrl);
      
      if (fileSize > MAX_FILE_SIZE) {
        console.log(`File size (${fileSize} bytes) exceeds maximum allowed size. Stopping upscaling.`);
        return currentUrl; // Return the last valid URL
      }
      
      currentUrl = newUrl;
      currentSize = Math.min(currentSize * scale, MAX_IMAGE_SIZE);
      
      console.log(`Upscaled to ${currentSize}px. New file size: ${fileSize} bytes (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

      if (currentSize >= MAX_IMAGE_SIZE) {
        console.log(`Reached maximum image size of ${MAX_IMAGE_SIZE}x${MAX_IMAGE_SIZE}. Stopping upscaling.`);
        break;
      }
    }

    const finalFileSize = await checkFileSize(currentUrl);
    console.log(`Final image size: ${currentSize}x${currentSize}px. URL: ${currentUrl}`);
    console.log(`Final file size: ${finalFileSize} bytes (${(finalFileSize / 1024 / 1024).toFixed(2)} MB)`);

    return currentUrl;
  } catch (error) {
    console.error('Error upscaling image with Pixelcut AI:', error);
    if (error.response) {
      console.error('Pixelcut AI API error response:', error.response.data);
    }
    throw error;
  }
}

module.exports = { upscaleImage, checkFileSize };