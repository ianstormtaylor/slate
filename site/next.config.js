/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  webpack: config => {
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      exclude: [/node_modules[\\/](next|@next)/],
      use: [
        {
          loader: 'source-map-loader',
        },
      ],
    })

    return config
  },
}

module.exports = nextConfig
