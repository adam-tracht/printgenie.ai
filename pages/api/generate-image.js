// pages/api/generate-image.js
import OpenAI from "openai";
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage for job status (replace with a database in production)
const jobStatus = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, action } = req.body;

  if (action === 'start') {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = uuidv4();
    jobStatus.set(jobId, { status: 'processing' });

    // Start the image generation process asynchronously
    generateImage(jobId, prompt);

    // Immediately return the job ID to the client
    res.status(202).json({ jobId, message: 'Image generation started' });
  } else if (action === 'status') {
    const { jobId } = req.body;
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
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    jobStatus.set(jobId, { status: 'completed', imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    jobStatus.set(jobId, { status: 'failed', error: error.message });
  }
}