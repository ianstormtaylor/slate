module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
  ],
  env: {
    webpack: {
      presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react',
      ],
      plugins: ['@babel/plugin-transform-runtime', 'react-hot-loader/babel'],
    },
    test: {
      inputSourceMap: true,
      presets: [
        '@babel/preset-typescript',
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
      ],
    },
  },
}
