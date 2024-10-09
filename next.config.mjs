/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "cdn.dummyjson.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
