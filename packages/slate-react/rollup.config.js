import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

// UMD build for browsers
const umdConfig = {
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    name: 'slate-react',
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
    resolve({
      preferBuiltins: false,
    }),
    commonjs({
      exclude: ['src/**'],
    }),
    builtins(),
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
    'debug',
    'get-window',
    'immutable',
    'is-hotkey',
    'is-in-browser',
    'is-window',
    'keycode',
    'lodash.throttle',
    'prop-types',
    'react',
    'react-dom',
    'react-dom/server',
    'react-immutable-proptypes',
    'react-portal',
    'selection-is-backward',
    'slate',
    'slate-base64-serializer',
    'slate-dev-logger',
    'slate-plain-serializer',
    'slate-prop-types',
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
