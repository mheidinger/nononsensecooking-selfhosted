import dotenv from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";

if (process.env.DOT_FILE_PATH) {
  dotenv.config({ path: process.env.DOT_FILE_PATH });
}

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 */
const { env } = await import("./src/env.js");

const nextConfig = {
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 80],
    remotePatterns: [
      {
        hostname: env.S3_DOMAIN,
      },
    ],
  },
  serverExternalPackages: ["@aws-sdk", "sharp"],
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Provide the path to the messages that you're using in `AppConfig`
    createMessagesDeclaration: "./messages/en.json",
  },
});

export default withNextIntl(nextConfig);
