import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { createRequest } from '@aws-sdk/util-create-request';
import { formatUrl } from '@aws-sdk/util-format-url';
import { HttpRequest } from "@aws-sdk/types";
import { Readable } from 'stream';

const client = new S3Client({endpoint: process.env.S3_ENDPOINT, forcePathStyle: true});
const signer: S3RequestPresigner = new S3RequestPresigner({...client.config});
const bucket = process.env.BUCKET_NAME

type S3File = {
  prefix: string;
  key: string;
  lastModified: Date;
};

export async function listFiles(prefix: string): Promise<S3File[]> {
  const command = new ListObjectsCommand({Bucket: bucket, Prefix: prefix});
  const results = await client.send(command);
  return results.Contents.map((item) => { return {
    key: item.Key.replace(prefix, ""),
    lastModified: item.LastModified,
    prefix
  }});
}

export async function fetchS3File(key: string): Promise<string> {
  const command = new GetObjectCommand({Bucket: bucket, Key: key});
  const results = await client.send(command);
  return streamToString(results.Body as Readable);
}

export async function getSignedGetObjectUrl(key: string, expireIn?: number): Promise<string> {
  const request = await createRequest(client, new GetObjectCommand( {
    Bucket: bucket,
    Key: key
  }));
  return signRequest(request, expireIn);
}

export async function getSignedPutObjectUrl(key: string, expireIn?: number): Promise<string> {
  const request = await createRequest(client, new PutObjectCommand( {
    Bucket: bucket,
    Key: key
  }));
  return signRequest(request, expireIn);
}

async function signRequest(request: HttpRequest, expiresIn?: number): Promise<string> {
  request.headers.host = `${request.hostname}:${request.port}`;
  const signed = await signer.presign(request, {expiresIn});
  return formatUrl(signed);
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}
