import "server-only";

import sharp from "sharp";
import { getPathForImage, getPathForOptimizedImage } from "./s3Paths";
import { getS3Client } from "./s3client";

const s3Client = getS3Client();

export async function optimizeImage(id: string) {
  try {
    const originalImagePath = getPathForImage(id);
    const imageBuffer = await s3Client.fetchFileAsBuffer(originalImagePath);

    const optimizedImage = await sharp(imageBuffer)
      .webp({
        quality: 80,
        lossless: false,
        effort: 4,
        smartSubsample: true,
      })
      .keepMetadata()
      .sharpen()
      .toBuffer();

    await s3Client.uploadFile(getPathForOptimizedImage(id), optimizedImage);
    console.log(`Optimized image ${id}`);
  } catch (error) {
    console.error(`Error optimizing image ${id}:`, error);
  }
}
