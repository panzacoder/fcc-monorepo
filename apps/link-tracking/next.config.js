const nextConfig = {
  rewrites() {
    return [
      {
        source: '/fccApi/2.0/:path*',
        destination: `${process.env.BASE_URL}/fccApi/2.0/:path*`
      }
    ]
  }
}

module.exports = nextConfig
