/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    domains: ["localhost"], // Add your hostnames here
  },
};

module.exports = nextConfig;
