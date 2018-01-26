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
    name: 'slate-react',
    format: 'umd',
    exports: 'named',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/server': 'ReactDOMServer',
      slate: 'Slate',
    },
  },
  external: [
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
      'get-window',
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
        exclude: ['node_modules/**']
      }),
    ]
  }
]
