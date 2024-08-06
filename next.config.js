import createNextIntlPlugin from "next-intl/plugin";

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
};

export default withNextIntl(nextConfig);
