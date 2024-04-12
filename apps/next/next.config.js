const { withExpo } = require('@expo/next-adapter')
/** @type {import('next').NextConfig} */
const nextConfig = {
  // reanimated (and thus, Moti) doesn't work with strict mode currently...
  // https://github.com/nandorojo/moti/issues/224
  // https://github.com/necolas/react-native-web/pull/2330
  // https://github.com/nandorojo/moti/issues/224
  // once that gets fixed, set this back to true
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'play.google.com'
      },
      {
        protocol: 'https',
        hostname: 'developer.apple.com'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    }
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource'
    })
    return config
  },
  transpilePackages: [
    '@expo/vector-icons',
    'app',
    'expo',
    'moti',
    'nativewind',
    'react-native',
    'react-native-css-interop',
    'react-native-gesture-handler',
    'react-native-autocomplete-dropdown',
    'react-native-animatable',
    'react-native-elements',
    'react-native-feather',
    'react-native-ratings',
    'react-native-vector-icons',
    'react-native-reanimated',
    'react-native-web',
    'solito'
  ],
  experimental: {
    forceSwcTransforms: true
  },
  async headers() {
    return [
      {
        source: '/fccApi/2.0/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ]
  },
  rewrites() {
    return [
      {
        source: '/fccApi/2.0/:path*',
        destination: `${process.env.BASE_URL}/fccApi/2.0/:path*`
      }
    ]
  }
}

module.exports = withExpo(nextConfig)
