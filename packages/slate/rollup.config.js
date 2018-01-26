import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const umdConfig = {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    name: 'slate',
    format: 'umd',
    exports: 'named',
    globals: {
      immutable: 'Immutable',
    },
  },
  external: [
    'immutable',
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    commonjs({
      exclude: ['src/**'],
      namedExports: {
        esrever: ['reverse'],
      },
    }),
    builtins(),
    babel({
      exclude: ['node_modules/**']
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
      'debug',
      'direction',
      'esrever',
      'immutable',
      'is-empty',
      'is-plain-object',
      'lodash/isEqual',
      'lodash/mergeWith',
      'lodash/omit',
      'lodash/pick',
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
        exclude: ['node_modules/**']
      }),
    ]
  }
]
