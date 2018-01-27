import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const umdConfig = {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    name: 'slate-html-serializer',
    format: 'umd',
    exports: 'named',
    globals: {
      immutable: 'Immutable',
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/server': 'ReactDOMServer',
      slate: 'Slate',
    },
  },
  external: [
    'immutable',
    'react',
    'react-dom',
    'react-dom/server',
    'slate',
  ],
  plugins: [
    resolve(),
    commonjs({
      exclude: ['src/**'],
    }),
    babel({
      include: ['src/**']
    }),
  ]
}

const umdConfigMin = Object.assign({}, umdConfig)
umdConfigMin.output = Object.assign({}, umdConfig.output, { file: pkg.browserMin })
umdConfigMin.plugins = umdConfig.plugins.slice(0).concat(uglify())

export default [
  // UMD build for browsers
  umdConfig,
  umdConfigMin,

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    external: [
      'immutable',
      'react',
      'react-dom',
      'react-dom/server',
      'slate',
      'slate-dev-logger',
      'type-of',
    ],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(),
      babel({
        include: ['src/**']
      }),
    ]
  }
]
