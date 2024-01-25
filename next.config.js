module.exports = {
    // Enable asset compression
    compress: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Enable optimizations only for client-side bundles
        config.mode = 'production';
      }
  
      return config;
    },
  };
  