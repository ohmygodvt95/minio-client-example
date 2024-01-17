/**
 *  Sử dụng minio library: npm i minio
 */
import 'dotenv/config'
import {Client} from 'minio'
import path from "path";
import mime from 'mime'

// Instantiate the minio client with the endpoint
// and access keys as shown below.
const {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT, AWS_BUCKET} = process.env

var minioClient = new Client({
  endPoint: AWS_ENDPOINT,
  useSSL: true,
  region: AWS_REGION,
  accessKey: AWS_ACCESS_KEY_ID,
  secretKey: AWS_SECRET_ACCESS_KEY,
})

// File that needs to be uploaded.
var filePath = './img.png'
minioClient.fPutObject(AWS_BUCKET, path.basename(filePath), filePath, {
  contentType: mime.getType(filePath),
}, function (err, etag) {
  if (err) return console.log(err)
  console.log('File uploaded successfully.', etag)
})

// available in 1 hour
minioClient.presignedGetObject(AWS_BUCKET, path.basename(filePath),  60 * 60, function (err, presignedUrl) {
  if (err) return console.log(err)
  console.log('presignedUrl', presignedUrl)
})
