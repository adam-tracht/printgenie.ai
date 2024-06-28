// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'files.cdn.printful.com',
      'printful-upload.s3-accelerate.amazonaws.com',
      'via.placeholder.com',
      'oaidalleapiprodscus.blob.core.windows.net'
    ],
  },
}

export default nextConfig;