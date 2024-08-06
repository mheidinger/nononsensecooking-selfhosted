import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { deleteFile } from "./deleteFile";
import { fetchFileAsBuffer } from "./fetchFileAsBuffer";
import { fetchFileAsString } from "./fetchFileAsString";
import { fileExists } from "./fileExists";
import { listFiles } from "./listFiles";
import resolveGetSignedUrl from "./resolveGetSignedUrl";
import { uploadFile } from "./uploadFile";

export default function getS3Client() {
  const client = new S3Client({
    forcePathStyle: true,
    endpoint: env.S3_ENDPOINT,
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const bucket = env.S3_BUCKET_NAME;

  return {
    listFiles: listFiles.bind(null, client, bucket),
    fileExists: fileExists.bind(null, client, bucket),
    fetchFileAsString: fetchFileAsString.bind(null, client, bucket),
    fetchFileAsBuffer: fetchFileAsBuffer.bind(null, client, bucket),
    uploadFile: uploadFile.bind(null, client, bucket),
    deleteFile: deleteFile.bind(null, client, bucket),
    getSignedUrl: resolveGetSignedUrl(client, bucket),
  };
}
