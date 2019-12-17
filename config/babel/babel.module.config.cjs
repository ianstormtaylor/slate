module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', {
      exclude: [
        '@babel/plugin-transform-regenerator',
        '@babel/transform-async-to-generator'
      ],
      modules: false,
      targets: {
        esmodules: true
      }
    }],
    '@babel/preset-react',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: false,
        useESModules: true
      }
    ],
    '@babel/plugin-proposal-class-properties',
  ],
}
