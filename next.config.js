module.exports = {
  compress: true,
  images: {
    domains: ["uppy.nheek.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.mode = "production";
    }

    return config;
  },
};
