const { jest: lernaAliases } = require('lerna-alias')

module.exports = {
  verbose: true,
  moduleNameMapper: lernaAliases(),
  collectCoverageFrom: ['**/src/**', '!**/test/**'],
  testMatch: ['**/packages/slate*/test/index.js'],
}
