import path from 'path'
import { cloneDeep } from 'lodash'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import pkg from '../../package.json'

const environment = process.env.NODE_ENV || 'development'

const configurations = []

const output = {
  umd: pkg.umd,
  umdMin: pkg.umdMin,
}

const umdConfig = {
  input: 'examples/index.js',
  output: {
    file: output.umd,
    name: 'slate-examples',
    format: 'umd',
    exports: 'named',
    sourcemap: environment === 'development',
  },
  plugins: [
    // Force rollup to use the browser variants of `debug` and `react-dom/server`
    // The main variant of `debug` relies on Node.js globals, while the main
    // variant of `react-dom/server` relies on Node.js's Stream.
    alias({
      debug: path.resolve(__dirname, 'node_modules/debug/src/browser'),
      'react-dom/server': path.resolve(__dirname, 'node_modules/react-dom/cjs/react-dom-server.browser.production.min'),
    }),

    // Allow rollup to resolve modules that are npm dependencies
    // (by default, it can only resolve local modules).
    resolve(),

    // Allow rollup to resolve npm dependencies that are CommonJS
    // (by default, it can only handle ES2015 syntax).
    commonjs({
      exclude: ['examples/**'],

      // The CommonJS plugin sometimes cannot correctly identify named
      // exports of CommonJS modules, so we manually specify here to
      // hint that e.g. `import { List } from 'immutable'` is a reference
      // to a valid named export.
      namedExports: {
        'esrever': ['reverse'],
        'immutable': ['List', 'Map', 'Record', 'OrderedSet', 'Set', 'Stack', 'is'],
        'react-dom': ['findDOMNode'],
        'react-dom/server': ['renderToStaticMarkup'],
      },
    }),

    // Convert JSON imports to ES6 modules.
    json(),

    // Replace `process.env.NODE_ENV` with its value -- needed for
    // some modules like React to use their production variant (and
    // one place within Slate itself).
    replace({
      'process.env.NODE_ENV': JSON.stringify(environment)
    }),

    // Use babel to transpile the result -- limit to package src
    // to prevent babel from trying to transpile npm dependencies.
    babel({
      include: ['examples/**']
    }),
  ],
  // Limit rollup's file watching to example src files and the
  // built output of packages -- helps keep it from watching
  // too much and choking.
  watch: {
    include: [
      'examples/**',
      'packages/*/lib/*.es.js',
    ],
  },
}

if (environment === 'production') {
  // Only build the minified UMD variant in production --
  // it makes each rebuild take substantially longer.
  const umdConfigMin = cloneDeep(umdConfig)
  umdConfigMin.output.file = output.umdMin
  umdConfigMin.plugins.push(uglify())
  configurations.push(umdConfigMin)
} else {
  // In development, add the sourcemaps plugin so they
  // are emitted alongside the dist file.
  umdConfig.plugins.push(sourcemaps())

  // Only build the unminified variant in development --
  // it serves no purpose in production.
  configurations.push(umdConfig)
}

export default configurations
