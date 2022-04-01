const fs = require('fs')
const path = require('path')

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.js$/,
      loader: require.resolve('source-map-loader'),
      enforce: 'pre',
      exclude: [/node_modules\/@next/, /node_modules\/next/],
    })
    return config
  },
}
