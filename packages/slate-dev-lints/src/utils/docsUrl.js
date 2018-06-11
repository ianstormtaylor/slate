const { name } = require('../../package')

function docsUrl(ruleName) {
  return `https://github.com/ianstormtaylor/slate/tree/master/packages/${name}/docs/rules/${ruleName}.md`
}

module.exports = docsUrl
