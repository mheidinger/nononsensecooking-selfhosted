import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";

export async function deleteFile(
  client: S3Client,
  bucket: string,
  key: string,
) {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await client.send(command);
}
