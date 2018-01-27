import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const umdConfig = {
  input: 'examples/index.js',
  output: {
    file: pkg.browser,
    name: 'slate-examples',
    format: 'umd',
    exports: 'named',
  },
  external: [
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    commonjs({
      exclude: ['examples/**'],
      namedExports: {
        esrever: ['reverse'],
        'immutable': ['List', 'Map', 'Record', 'OrderedSet', 'Set', 'Stack', 'is'],
        'react-dom': ['findDOMNode'],
      },
    }),
    json(),
    builtins(),
    babel({
      include: ['examples/**']
    }),
  ]
}

const umdConfigMin = Object.assign({}, umdConfig)
umdConfigMin.output = Object.assign({}, umdConfig.output, { file: pkg.browserMin })
const prodReplace = replace({ 'process.env.NODE_ENV': JSON.stringify('production') })
umdConfigMin.plugins = umdConfig.plugins.slice(0).concat(prodReplace, uglify())

umdConfig.plugins.push(replace({ 'process.env.NODE_ENV': JSON.stringify('development') }))

export default [
  // UMD build for browsers
  umdConfig,
  umdConfigMin,
]
