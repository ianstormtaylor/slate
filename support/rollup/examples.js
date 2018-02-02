import path from 'path'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import pkg from '../../package.json'

const configurations = []

const umdConfig = {
  input: 'examples/index.js',
  output: {
    file: pkg.umd,
    name: 'slate-examples',
    format: 'umd',
    exports: 'named',
    sourcemap: process.env.ROLLUP_WATCH,
  },
  plugins: [
    alias({
      debug: path.resolve(__dirname, 'node_modules', 'debug', 'src', 'browser'),
      'react-dom/server': path.resolve(__dirname, 'node_modules', 'react-dom', 'cjs', 'react-dom-server.browser.production.min'),
    }),
    resolve(),
    commonjs({
      exclude: ['examples/**'],
      namedExports: {
        esrever: ['reverse'],
        'immutable': ['List', 'Map', 'Record', 'OrderedSet', 'Set', 'Stack', 'is'],
        'react-dom': ['findDOMNode'],
        'react-dom/server': ['renderToStaticMarkup'],
      },
    }),
    json(),
    babel({
      include: ['examples/**']
    }),
  ],
  watch: {
    include: [
      'examples/**',
      'packages/*/lib/**',
    ],
  },
}

configurations.push(umdConfig)

if (process.env.ROLLUP_WATCH) {
  umdConfig.plugins.push(sourcemaps())
} else {
  const umdConfigMin = Object.assign({}, umdConfig)
  umdConfigMin.output = Object.assign({}, umdConfig.output, { file: pkg.umdMin })
  const prodReplace = replace({ 'process.env.NODE_ENV': JSON.stringify('production') })
  umdConfigMin.plugins = umdConfig.plugins.slice(0).concat(prodReplace, uglify())

  configurations.push(umdConfigMin)
}

umdConfig.plugins.push(replace({ 'process.env.NODE_ENV': JSON.stringify('development') }))

export default configurations
