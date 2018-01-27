import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import pkg from './package.json'

// UMD build for browsers
const umdConfig = {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    name: 'slate-dev-logger',
    format: 'umd',
    exports: 'named',
  },
  plugins: [
    resolve(),
    commonjs({
      exclude: ['src/**'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
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
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: process.env.ROLLUP_WATCH },
    { file: pkg.module, format: 'es', sourcemap: process.env.ROLLUP_WATCH }
  ],
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      include: ['src/**']
    }),
  ]
}

const configurations = [moduleConfig]
if (process.env.ROLLUP_WATCH) {
  moduleConfig.plugins.push(sourcemaps())
} else {
  configurations.push(umdConfig, umdConfigMin)
}

export default configurations
