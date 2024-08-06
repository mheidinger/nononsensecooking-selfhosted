import "server-only";

import sharp from "sharp";
import {
  getKeyForOptimizedImage,
  getPathForOptimizedImage,
  ImageOptimizedSuffix,
  S3RecipeImagesBasePath,
} from "./s3Paths";
import { getS3Client, type S3File } from "./s3client";

const s3Client = getS3Client();

function getIdFromKey(originalImageKey: string): string {
  const parts = originalImageKey.split(".");
  return parts[0]!;
}

async function getImagesToOptimize() {
  const imageFiles = await s3Client.listFiles(S3RecipeImagesBasePath + "/");
  return imageFiles
    .map((file) => {
      if (file.key.includes(ImageOptimizedSuffix)) {
        return;
      }
      const optimizedVersionExists = imageFiles.some(
        (f) => f.key === getKeyForOptimizedImage(getIdFromKey(file.key)),
      );
      return optimizedVersionExists ? undefined : file;
    })
    .filter((file) => file !== undefined);
}

async function doOptimization({ key, path }: S3File) {
  try {
    const imageBuffer = await s3Client.fetchFileAsBuffer(path);

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

    await s3Client.uploadFile(
      getPathForOptimizedImage(getIdFromKey(key)),
      optimizedImage,
    );
    console.log(`Optimized image ${key}`);
  } catch (error) {
    console.error(`Error optimizing image ${key}:`, error);
  }
}

export async function optimizeImages() {
  const imagesToOptimize = await getImagesToOptimize();
  for (const file of imagesToOptimize) {
    await doOptimization(file);
  }
}
