import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export async function uploadToS3(file, userId, folderName) {
  const { filename, createReadStream } = await file;
  const newFilename = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const readStream = createReadStream();
  const uploadParams = {
    Bucket: process.env.S3_BUCKET, // bucket name
    Key: newFilename, // the name of the selected file
    ACL: 'public-read', // 'private' | 'public-read'
    Body: readStream,
  };
  const parallelUploads3 = new Upload({
    client: s3,
    params: uploadParams,
  });
  await parallelUploads3.done();
  // await s3.send(new PutObjectCommand(uploadParams));
  return `${process.env.S3_BASE_URL}/${newFilename}`;
}
