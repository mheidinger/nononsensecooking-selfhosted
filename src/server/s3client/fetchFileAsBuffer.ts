import { GetObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { type Readable } from "stream";

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk as Uint8Array));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function fetchFileAsBuffer(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<Buffer> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const results = await client.send(command);
  return streamToBuffer(results.Body as Readable);
}
