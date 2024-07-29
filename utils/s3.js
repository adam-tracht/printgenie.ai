// utils/s3.js
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Upload an image to S3
export const uploadImageToS3 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const fileType = response.headers.get('content-type');
    const fileName = `${uuidv4()}.${fileType.split('/')[1]}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: fileType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};

// Get a signed URL for an S3 object
export const getSignedUrl = (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 60 * 60 * 24 * 7 // URL expires in 7 days
  };

  return s3.getSignedUrl('getObject', params);
};