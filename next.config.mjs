// next.config.mjs

import path from "path";

/** @type {import('next').NextConfig} */
export const nextConfig = {
  webpack(config) {
    // Allow dynamic expressions without warning
    config.module.exprContextCritical = false;

    // Add alias support
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd(), "src"), // Use process.cwd() in .mjs
    };

    return config;
  },

  images: {
    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org", // ✅ add this line
    ],
  },
};

export default nextConfig; // ✅ Required for Next.js to pick it up
