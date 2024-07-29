// pages/api/images/[id].js
import dbConnect from '../../../utils/database';
import Image from '../../../models/Image';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const image = await Image.findById(id);
        if (!image) {
          return res.status(404).json({ success: false, error: 'Image not found' });
        }
        res.status(200).json({ success: true, data: image });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Invalid method' });
      break;
  }
}