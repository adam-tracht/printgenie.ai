// pages/api/generate-image.js
import OpenAI from "openai";
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../utils/database';
import Image from '../../models/Image';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage for job status (replace with a database in production)
const jobStatus = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, action, jobId } = req.body;

  if (action === 'start') {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const newJobId = uuidv4();
    jobStatus.set(newJobId, { status: 'processing' });

    // Add instructions to the prompt
    const modifiedPrompt = `Please generate the image as described. Do not include the term "wall art" in any context or expand with verbose descriptions. ${prompt}`;

    // Start the image generation process asynchronously
    generateImage(newJobId, modifiedPrompt);

    // Immediately return the job ID to the client
    res.status(202).json({ jobId: newJobId, message: 'Image generation started' });
  } else if (action === 'status') {
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const status = jobStatus.get(jobId);
    if (!status) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(status);
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
}

async function generateImage(jobId, prompt) {
  try {
    console.log(`Generating image for job ${jobId} with prompt: ${prompt}`);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log('OpenAI API response:', response);
    const imageUrl = response.data[0].url;
    console.log(`Image generated successfully for job ${jobId}. URL: ${imageUrl}`);

    let imageId = null;

    try {
      // Connect to the database
      await dbConnect();

      // Save the image URL and prompt to the database
      const newImage = new Image({
        url: imageUrl,
        prompt: prompt,
      });
      const savedImage = await newImage.save();
      imageId = savedImage._id;

      console.log(`Image saved to database with ID: ${imageId}`);
    } catch (dbError) {
      console.error('Error saving image to database:', dbError);
      // Continue with the process even if database save fails
    }

    jobStatus.set(jobId, { status: 'completed', imageUrl, imageId });
  } catch (error) {
    console.error(`Error generating image for job ${jobId}:`, error);
    jobStatus.set(jobId, { status: 'failed', error: error.message });
  }
}