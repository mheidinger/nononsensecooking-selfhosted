import { ListObjectsCommand, type S3Client } from "@aws-sdk/client-s3";
import { type S3File } from "./S3File";

export async function listFiles(
  client: S3Client,
  bucket: string,
  prefix: string,
): Promise<S3File[]> {
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
