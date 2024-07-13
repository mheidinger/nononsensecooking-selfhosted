import sharp from "sharp";
import {
  getKeyForOptimizedImage,
  getPathForOptimizedImage,
  ImageOptimizedSuffix,
  S3RecipeImagesBasePath,
} from "./s3Paths";
import { fetchFileAsBuffer, listFiles, S3File, uploadFile } from "./s3client";

function getIdFromKey(originalImageKey: string) {
  const parts = originalImageKey.split(".");
  return parts[0];
}

async function getImagesToOptimize() {
  const imageFiles = await listFiles(S3RecipeImagesBasePath + "/");
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
    const imageBuffer = await fetchFileAsBuffer(path);

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

    await uploadFile(
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
  imagesToOptimize.forEach((file) => {
    doOptimization(file);
  });
}
