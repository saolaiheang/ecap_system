/** @type {import('next').NextConfig} */
// const path = require('path');


export const nextConfig = {
  webpack(config) {
    // Allow dynamic expressions without warning
    config.module.exprContextCritical = false;

    // Add alias support
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    return config;
  },

  images: {
    domains: ['res.cloudinary.com'],
  },
};

// module.exports = nextConfig;


