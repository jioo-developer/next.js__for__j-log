/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    reactStrictMode: false,
    includePaths: ["app/_asset"], // styles 폴더를 SCSS 파일의 경로로 설정
    prependData: `@import "@/app/_asset/_mixin.scss";`, // _mixin.scss 파일의 경로를 정확히 설정
  },
  images: {
    domains: [
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_GOGGLE_API,
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_GOGGLE_USER,
      "lh3.googleusercontent.com",
    ],
    unoptimized: true,
  },
};

export default nextConfig;
