'use strict'
require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  inputSourceMap: true,
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          slate: './packages/slate/src/index.ts',
          'slate-history': './packages/slate-history/src/index.ts',
          'slate-react': './packages/slate-react/src/index.ts',
          'slate-dom': './packages/slate-dom/src/index.ts',
          'slate-hyperscript': './packages/slate-hyperscript/src/index.ts',
        },
      },
    ],
  ],
  presets: [
    '@babel/preset-typescript',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
})

const { jsx } = require('../../packages/slate-hyperscript/src')

global.React = {
  Fragment: 'fragment',
  createElement: jsx,
}
