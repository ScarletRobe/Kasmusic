/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost']
  },
  staticPageGenerationTimeout: 200,
}

module.exports = nextConfig
