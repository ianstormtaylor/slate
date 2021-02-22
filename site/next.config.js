const fs = require('fs')
const path = require('path')

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
      exclude: [/node_modules\/@next/, /node_modules\/next/],
    })
    return config
  },
}
