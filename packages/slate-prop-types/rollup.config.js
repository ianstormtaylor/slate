import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

// UMD build for browsers
const umdConfig = {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    name: 'slate-prop-types',
    format: 'umd',
    exports: 'named',
    globals: {
      immutable: 'Immutable',
      slate: 'Slate',
    },
  },
  external: [
    'immutable',
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

// Additional UMD minified build based off of the unminified config
const umdConfigMin = Object.assign({}, umdConfig)
umdConfigMin.output = Object.assign({}, umdConfig.output, { file: pkg.browserMin })
umdConfigMin.plugins = umdConfig.plugins.slice(0).concat(uglify())

// CommonJS (for Node) and ES module (for bundlers) build.
const moduleConfig = {
  input: 'src/index.js',
  external: [
    'immutable',
    'slate',
    'slate-dev-logger',
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

const configurations = [moduleConfig]
if (!process.env.ROLLUP_WATCH) {
  configurations.push(umdConfig, umdConfigMin)
}

export default configurations
