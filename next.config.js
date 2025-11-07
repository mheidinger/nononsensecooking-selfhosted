import dotenv from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";

if (process.env.DOT_FILE_PATH) {
  dotenv.config({ path: process.env.DOT_FILE_PATH });
}

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 */
const { env } = await import("./src/env.js");

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: env.S3_DOMAIN,
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@aws-sdk"],
    instrumentationHook: true,
  },
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

export default withNextIntl(nextConfig);
