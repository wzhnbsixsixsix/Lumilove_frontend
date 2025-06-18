/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://16.176.180.19:8080/api/users/:path*',
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://16.176.180.19:8080/api/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://16.176.180.19:8080/api/:path*',
      },
    ]
  }
}

module.exports = nextConfig 