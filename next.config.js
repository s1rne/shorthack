/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone', // Для Docker - раскомментируй при деплое
  turbopack: {},
};

module.exports = nextConfig;

