const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config(); // Load environment variables

// Load AWS credentials and region from environment variables
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Instantiate the S3 client
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Function to list S3 buckets
const listBuckets = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log('S3 Buckets:', data.Buckets);
    return data.Buckets; // Return bucket data if needed
  } catch (err) {
    console.error('Error connecting to AWS:', err.message);
    throw err; // Re-throw the error for external handling
  }
};

// Export both the S3 client and the listBuckets function
module.exports = {
  s3Client,
  listBuckets,
};
