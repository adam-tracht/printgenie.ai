// models/Image.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);