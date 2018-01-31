import path from 'path'
import alias from 'rollup-plugin-alias'
import autoExternal from 'rollup-plugin-auto-external'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default ({ pkg, umd, modules = {}}) => {
  // UMD build for browsers
  const umdConfig = {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      name: umd.name,
      format: 'umd',
      exports: 'named',
      globals: umd.globals,
    },
    external: umd.external,
    plugins: [
      alias({
        debug: path.resolve(__dirname, '..', '..', 'node_modules', 'debug', 'src', 'browser'),
      }),
      resolve(),
      commonjs({
        exclude: ['src/**'],
        namedExports: {
          esrever: ['reverse'],
          'immutable': ['List', 'Map', 'Record', 'OrderedSet', 'Set', 'Stack', 'is'],
          'react-dom': ['findDOMNode'],
          'react-dom/server': ['renderToStaticMarkup'],
        },
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
    external: modules.external,
    plugins: [
      autoExternal(),
      alias({
        debug: path.resolve(__dirname, '..', 'node_modules', 'debug', 'src', 'browser'),
        'react-dom/server': path.resolve(__dirname, '..', 'node_modules', 'react-dom', 'cjs', 'react-dom-server.browser.production.min'),
      }),
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

  return configurations
}
