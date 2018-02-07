import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import uglify from 'rollup-plugin-uglify'
import pkg from '../../package.json'

/**
 * Return a Rollup configuration for the examples with `env`.
 *
 * @param {String} env
 * @return {Object}
 */

function configure(env) {
  const isDev = env === 'development'
  const isProd = env === 'production'

  return {
    input: 'examples/index.js',
    output: {
      file: isProd ? pkg.umdMin : pkg.umd,
      name: 'slate-examples',
      format: 'umd',
      exports: 'named',
      sourcemap: isDev,
    },
    watch: {
      include: ['examples/**', 'packages/*/lib/*.es.js'],
    },
    plugins: [
      // Allow Rollup to resolve modules from `node_modules`, since it only
      // resolves local modules by default.
      resolve({
        browser: true,
        preferBuiltins: true,
      }),

      // Allow Rollup to resolve CommonJS modules, since it only resolves ES2015
      // modules by default.
      commonjs({
        exclude: ['examples/**'],
        // HACK: Sometimes the CommonJS plugin can't identify named exports, so
        // we have to manually specify named exports here for them to work.
        // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
        namedExports: {
          esrever: ['reverse'],
          immutable: [
            'List',
            'Map',
            'Record',
            'OrderedSet',
            'Set',
            'Stack',
            'is',
          ],
          'react-dom': ['findDOMNode'],
          'react-dom/server': ['renderToStaticMarkup'],
        },
      }),

      // Convert JSON imports to ES6 modules.
      json(),

      // Replace `process.env.NODE_ENV` with its value, which enables some
      // modules like React and Slate to use their production variant.
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),

      // Register Node.js builtins for browserify compatibility.
      builtins(),

      // Use Babel to transpile the result, limiting it to the source code.
      babel({
        include: ['examples/**'],
      }),

      // Register Node.js globals for browserify compatibility.
      globals(),

      // Only minify the output in production, since it is very slow.
      isProd && uglify(),

      // Only add sourcemaps in development.
      isDev && sourcemaps(),
    ].filter(Boolean),
  }
}

/**
 * Export.
 *
 * @type {Array}
 */

export default [
  configure('development'),
  process.env.NODE_ENV === 'production' && configure('production'),
].filter(Boolean)
