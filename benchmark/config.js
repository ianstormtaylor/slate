const { resolve } = require('path')
const { existsSync } = require('fs')

const config = resolve(`${__dirname}/../benchmark-config.js`)

if (existsSync(config)) {
  const userConfig = require(config)
  if (userConfig.include) {
    module.exports.include = userConfig.include
  } else {
    module.exports.inlcude = userConfig.default
  }
} else {
  module.exports.include = {
    slate: /^/,
    'slate-html-serializer': /^/,
    'slate-plain-serializer': /^/,
    'slate-react': /^/,
  }
}
