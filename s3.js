/**
 *  Sử dụng s3 library: npm i @aws-sdk/client-s3
 */
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import fs from "fs";
import 'dotenv/config'
import mime from 'mime'

const {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT, AWS_BUCKET} = process.env
const s3client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  endpoint: 'https://' + AWS_ENDPOINT,
  forcePathStyle: true,
})

// Upload file to storage
const putFile = async (bucket, filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: path.basename(filePath),
    Body: fileStream,
    ContentType: mime.getType(filePath) // need mime type for public url generate
  });

  return await s3client.send(command);
}

// get public url and expires in 3600 second
const getPresignedUrl = async (bucket, path) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });

  return await getSignedUrl(s3client, command, { expiresIn: 3600, "content-type": "image/png" });
}

console.log('# UPLOAD FILE')
const FILE_PATH = './img.png'
try {
  const file = await putFile(AWS_BUCKET, FILE_PATH );
  console.info("File uploaded", file);
} catch (e) {
  console.error(e)
}

console.log('# GET PUBLIC URL')

try {
  const publicUrl = await getPresignedUrl(AWS_BUCKET, path.basename(FILE_PATH));
  console.info("File link", publicUrl);
} catch (e) {
  console.error(e)
}

