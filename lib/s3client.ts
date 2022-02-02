import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from 'stream';

const client = new S3Client({endpoint: "http://localhost:9000", forcePathStyle: true});
const bucket = process.env.BUCKET_NAME

export async function fetchS3File(key: string): Promise<string> {
  const command = new GetObjectCommand({Bucket: bucket, Key: key});
  const results = await client.send(command);
  return streamToString(results.Body as Readable);
}

export async function getSignedGetObjectUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({Bucket: bucket, Key: key});
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function getSignedPutObjectUrl(key: string): Promise<string> {
  const command = new PutObjectCommand({Bucket: bucket, Key: key});
  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}
