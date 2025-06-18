/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://54.206.37.109:8080/api/users/:path*',
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://54.206.37.109:8080/api/auth/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://54.206.37.109:8080/api/:path*',
      },
    ]
  }
}

module.exports = nextConfig 