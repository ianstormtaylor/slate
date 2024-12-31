const fs = require('fs')
const path = require('path')

module.exports = {
  output: 'export',
  webpack: config => {
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      exclude: [/node_modules[\\/](?:@next|next)/],
      use: [
        {
          loader: require.resolve('source-map-loader'),
        },
      ],
    })
    return config
  },
}
