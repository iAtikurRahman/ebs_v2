const aws = require('aws-sdk');

// AWS S3 configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_MINIO_ENDPOINT,
  s3ForcePathStyle: true,
});

module.exports = {s3};