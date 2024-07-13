export async function register() {
  // only run this on server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { optimizeImages } = await import("./lib/imageOptimizer");

    // Call once
    optimizeImages();

    // Execute optimizeImages every 10 minutes
    setInterval(optimizeImages, 600000); // 600000 milliseconds = 10 minutes
  }
}
