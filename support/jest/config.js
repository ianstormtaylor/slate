const { jest: lernaAliases } = require('lerna-alias')
const { resolve } = require('path')

const rootDir = resolve(__dirname, '../../')

module.exports = {
  verbose: true,
  moduleNameMapper: lernaAliases(),
  collectCoverageFrom: ['**/src/**', '!**/test/**'],
  rootDir,
  testMatch: ['<rootDir>/packages/slate*/test/index.js'],
}
