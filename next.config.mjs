/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ["styles"],
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
