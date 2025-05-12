/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        // allow dynamic expressions without complaint
        config.module.exprContextCritical = false;
        return config;
      },
};

export default nextConfig;
