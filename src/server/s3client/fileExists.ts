import { HeadObjectCommand, type S3Client } from "@aws-sdk/client-s3";

export async function fileExists(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<boolean> {
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
