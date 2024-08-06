import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { type StreamingBlobPayloadInputTypes } from "@smithy/types";

export async function uploadFile(
  client: S3Client,
  bucket: string,
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
