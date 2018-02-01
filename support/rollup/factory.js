import path from 'path'
import { startCase } from 'lodash'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default (pkg) => {
  // UMD build for browsers
  const umdConfig = {
    input: `packages/${pkg.name}/src/index.js`,
    output: {
      file: `packages/${pkg.name}/${pkg.browser}`,
      name: startCase(pkg.name).replace(/ /g, ''),
      format: 'umd',
      exports: 'named',
      globals: pkg.umdGlobals,
    },
    external: Object.keys(pkg.umdGlobals || {}),
    plugins: [
      alias({
        debug: path.resolve(__dirname, 'node_modules', 'debug', 'src', 'browser'),
      }),
      resolve(),
      commonjs({
        exclude: [`packages/${pkg.name}/src/**`],
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
        include: [`packages/${pkg.name}/src/**`]
      }),
    ]
  }

  // Additional UMD minified build based off of the unminified config
  const umdConfigMin = Object.assign({}, umdConfig)
  umdConfigMin.output = Object.assign({}, umdConfig.output, { file: `packages/${pkg.name}/${pkg.browserMin}` })
  umdConfigMin.plugins = umdConfig.plugins.slice(0).concat(uglify())

  // Generate list of external dependencies from package.json
  let dependencies = []
  if (pkg.dependencies) {
    dependencies = dependencies.concat(Object.keys(pkg.dependencies))
  }
  if (pkg.peerDependencies) {
    dependencies = dependencies.concat(Object.keys(pkg.peerDependencies))
  }

  // CommonJS (for Node) and ES module (for bundlers) build.
  const moduleConfig = {
    input: `packages/${pkg.name}/src/index.js`,
    output: [
      {
        file: `packages/${pkg.name}/${pkg.main}`,
        format: 'cjs',
        exports: 'named',
        sourcemap: process.env.ROLLUP_WATCH,
      },
      {
        file: `packages/${pkg.name}/${pkg.module}`,
        format: 'es',
        sourcemap: process.env.ROLLUP_WATCH,
      },
    ],
    external: id => !!dependencies.find(dep => dep === id || id.startsWith(`${dep}/`)),
    plugins: [
      alias({
        debug: path.resolve(__dirname, 'node_modules', 'debug', 'src', 'browser'),
      }),
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      babel({
        include: [`packages/${pkg.name}/src/**`]
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
