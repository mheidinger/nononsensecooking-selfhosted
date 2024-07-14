/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { type HttpRequest } from "@aws-sdk/types";
import { createRequest } from "@aws-sdk/util-create-request";
import { formatUrl } from "@aws-sdk/util-format-url";
import { type StreamingBlobPayloadInputTypes } from "@smithy/types";
import "server-only";
import { type Readable } from "stream";
import { env } from "~/env";

const client = new S3Client({
  forcePathStyle: true,
  endpoint: env.S3_ENDPOINT,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
const signer: S3RequestPresigner = new S3RequestPresigner({ ...client.config });
const bucket = env.S3_BUCKET_NAME;

export interface S3File {
  prefix: string;
  key: string;
  path: string;
}

export async function listFiles(prefix: string): Promise<S3File[]> {
  const command = new ListObjectsCommand({ Bucket: bucket, Prefix: prefix });
  const results = await client.send(command);
  const content = results.Contents ? results.Contents : [];
  return content
    .map((item) => {
      return {
        key: item.Key!.replace(prefix, ""),
        prefix,
        path: item.Key!,
      };
    })
    .filter((item) => item.key !== "");
}

export async function fetchFileAsString(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const results = await client.send(command);
  return streamToString(results.Body as Readable);
}

export async function fetchFileAsBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const results = await client.send(command);
  return streamToBuffer(results.Body as Readable);
}

export async function uploadFile(
  key: string,
  file: StreamingBlobPayloadInputTypes,
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
  });
  await client.send(command);
}

export async function fileExists(key: string): Promise<boolean> {
  const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
  try {
    await client.send(command);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await client.send(command);
}

export async function getSignedGetObjectUrl(
  key: string,
  expireIn?: number,
): Promise<string> {
  const request = await createRequest(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
  return signRequest(request, expireIn);
}

export async function getSignedPutObjectUrl(
  key: string,
  expireIn?: number,
): Promise<string> {
  const request = await createRequest(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
  return signRequest(request, expireIn);
}

async function signRequest(
  request: HttpRequest,
  expiresIn?: number,
): Promise<string> {
  const signed = await signer.presign(request, { expiresIn });
  return formatUrl(signed);
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk as Uint8Array));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk as Uint8Array));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
