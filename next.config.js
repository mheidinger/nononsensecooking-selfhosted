const { i18n } = require("./next-i18next.config");
const webpack = require('webpack');
const dotenv = require('dotenv');

const { parsed: awsEnv } = dotenv.config({
    path:'/run/secrets/nononsensecooking-aws'
});

module.exports = {
  i18n,
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [process.env.S3_DOMAIN],
  },
  webpack(config) {
    if (awsEnv) {
      config.plugins.push(new webpack.EnvironmentPlugin(awsEnv))
    }
    return config
  },
};
