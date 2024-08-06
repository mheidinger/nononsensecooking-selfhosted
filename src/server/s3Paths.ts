import "server-only";

export const S3RecipeFilesBasePath = "recipes";
export const S3RecipeImagesBasePath = "images";

export function getPathForRecipe(id: string): string {
  return `${S3RecipeFilesBasePath}/${id}.yaml`;
}

export function getPathForImage(id: string): string {
  return `${S3RecipeImagesBasePath}/${id}.jpg`;
}

export const ImageOptimizedSuffix = "--optimized-v1";
export function getKeyForOptimizedImage(id: string): string {
  return `${id}${ImageOptimizedSuffix}.webp`;
}
export function getPathForOptimizedImage(id: string): string {
  return `${S3RecipeImagesBasePath}/${getKeyForOptimizedImage(id)}`;
}
