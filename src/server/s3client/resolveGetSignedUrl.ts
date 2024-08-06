import {
  GetObjectCommand,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { createRequest } from "@aws-sdk/util-create-request";
import { formatUrl } from "@aws-sdk/util-format-url";
import { type HttpRequest } from "@smithy/types";
import NodeCache from "node-cache";

async function signRequest(
  signer: S3RequestPresigner,
  request: HttpRequest,
  expiresIn?: number,
): Promise<string> {
  const signed = await signer.presign(request, { expiresIn });
  return formatUrl(signed);
}

async function getSignedUrl(
  signer: S3RequestPresigner,
  client: S3Client,
  cache: NodeCache,
  bucket: string,
  key: string,
  allowedOperation: "get" | "put",
  expireIn?: number,
): Promise<string> {
  if (expireIn) {
    const cachedUrl = cache.get<string>(key);
    if (cachedUrl) {
      console.log("Using cached signed URL for ", key);
      return cachedUrl;
    }
  }

  const command =
    allowedOperation === "put"
      ? new PutObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      : new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });
  const request = await createRequest(client, command);
  const signedUrl = await signRequest(signer, request, expireIn);

  if (expireIn) {
    cache.set(key, signedUrl, expireIn);
  }

  return signedUrl;
}

export default function resolveGetSignedUrl(client: S3Client, bucket: string) {
  const signer = new S3RequestPresigner({ ...client.config });
  const cache = new NodeCache();
  return getSignedUrl.bind(null, signer, client, cache, bucket);
}
