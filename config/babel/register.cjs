'use strict'
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '../..')

require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  inputSourceMap: true,
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          slate: path.join(repoRoot, 'packages/slate/src/index.ts'),
          'slate-history': path.join(
            repoRoot,
            'packages/slate-history/src/index.ts'
          ),
          'slate-react': path.join(
            repoRoot,
            'packages/slate-react/src/index.ts'
          ),
          'slate-dom': path.join(repoRoot, 'packages/slate-dom/src/index.ts'),
          'slate-hyperscript': path.join(
            repoRoot,
            'packages/slate-hyperscript/src/index.ts'
          ),
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

const { jsx } = require(path.join(repoRoot, 'packages/slate-hyperscript/src'))

global.React = {
  Fragment: 'fragment',
  createElement: jsx,
}
