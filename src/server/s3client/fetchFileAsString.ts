import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { type Readable } from "stream";

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk as Uint8Array));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

export async function fetchFileAsString(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const results = await client.send(command);
  return streamToString(results.Body as Readable);
}
