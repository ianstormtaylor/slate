require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  inputSourceMap: true,
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
})
