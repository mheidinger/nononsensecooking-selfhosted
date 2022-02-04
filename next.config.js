const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  reactStrictMode: true,
  experimental: {
    styledComponents: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [process.env.S3_DOMAIN],
  },
};
