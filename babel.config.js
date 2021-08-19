// Needed for jest.
module.exports = {
  inputSourceMap: true,
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
}
