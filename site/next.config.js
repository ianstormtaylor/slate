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
  // https://answers.netlify.com/t/basic-nextjs-website-failing-to-build-with-exit-code-129/120273/2
  experimental: {
    cpus: 1,
  },
}
