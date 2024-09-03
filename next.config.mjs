/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ["styles"],
  },
  images: {
    domains: [
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_GOGGLE_API,
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_GOGGLE_USER,
    ],
  },
};

export default nextConfig;
