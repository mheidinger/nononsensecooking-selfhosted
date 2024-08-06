export async function register() {
  // only run this on server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { optimizeImages } = await import("./server/imageOptimizer");

    function safeOptimizeImages() {
      optimizeImages().catch((error) => {
        console.error("Error optimizing images:", error);
      });
    }

    // Call once
    safeOptimizeImages();

    // Execute optimizeImages every 10 minutes
    setInterval(safeOptimizeImages, 600000); // 600000 milliseconds = 10 minutes
  }
}
