const { resolve } = require('path')
const { existsSync } = require('fs')

const config = resolve(`${__dirname}/../benchmark-config.js`)

if (existsSync(config)) {
  module.exports = require(config)
} else {
  module.exports.include = {
    slate: /^/,
    'slate-html-serializer': /^/,
    'slate-plain-serializer': /^/,
    'slate-react': /^/,
  }
}
