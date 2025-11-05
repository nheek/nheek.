module.exports = {
  compress: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uppy.nheek.com",
        pathname: "/**", // Allows all image paths from the domain
      },
      {
        protocol: "https",
        hostname: "next.nheek.com",
        pathname: "/**", // Allows all image paths from the domain
      },
    ],
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.mode = "production";
    }

    return config;
  },
};
