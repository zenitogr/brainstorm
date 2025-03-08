/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for Tauri
  images: {
    unoptimized: true,  // Required for static export
  },
  // Disable server-side features
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
