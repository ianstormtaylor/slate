const fs = require('fs')
const path = require('path')

module.exports = {
  exportPathMap: async (defaultPathMap, config) => {
    const { dir } = config
    const examples = fs.readdirSync(path.resolve(dir, 'examples'))
    const pages = {
      '/': { page: '/' },
    }

    for (const file of examples) {
      if (!file.endsWith('.tsx') || !file.endsWith('.js')) {
        continue
      }

      const example = file.replace('.tsx', '')
      pages[`/examples/${example}`] = { page: '/examples/[example]', example }
    }

    return pages
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    })
    return config
  },
}
