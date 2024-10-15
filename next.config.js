module.exports = {
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uppy.nheek.com',
        pathname: '/**', // Allows all image paths from the domain
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.mode = "production";
    }

    return config;
  },
};
