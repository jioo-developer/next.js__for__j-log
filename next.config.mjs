/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ["styles"],
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
