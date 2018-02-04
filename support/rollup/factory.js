import path from 'path'
import { startCase, cloneDeep } from 'lodash'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const environment = process.env.NODE_ENV || 'development'

export default (pkg) => {
  const pkgName = pkg.name
  const output = {
    cjs: pkg.main,
    es: pkg.module,
    umd: pkg.umd,
    umdMin: pkg.umdMin,
  }
  const umdGlobals = pkg.umdGlobals

  // Generate list of external dependencies from package.json
  let dependencies = []
  if (pkg.dependencies) {
    dependencies = dependencies.concat(Object.keys(pkg.dependencies))
  }
  if (pkg.peerDependencies) {
    dependencies = dependencies.concat(Object.keys(pkg.peerDependencies))
  }

  // Consider a dependency external if:
  // 1. It is directly located in the package.json dependencies/peerDependencies (e.g. `react`), or
  // 2. It is part of a package.json dependency (e.g. `lodash/omit`)
  // External dependencies are expected to be present at runtime (rather than being bundled into
  // our built dist).
  const isExternalDependency = id => !!dependencies.find(dep => dep === id || id.startsWith(`${dep}/`))

  // UMD build for browsers
  const umdConfig = {
    input: `packages/${pkgName}/src/index.js`,

    output: {
      file: `packages/${pkgName}/${output.umd}`,
      format: 'umd',
      exports: 'named',

      // For a package name such as `slate-react`, the UMD name
      // should be SlateReact.
      name: startCase(pkgName).replace(/ /g, ''),

      // Some packages contain `umdGlobals` in their package.json, which
      // indicates external dependencies that should be treated as globals
      // rather than bundled into our dist, such as Immutable and React.
      globals: umdGlobals,
    },

    // `external` tells rollup to treat the umdGlobals as external (and
    // thus skip bundling them).
    external: Object.keys(umdGlobals || {}),

    plugins: [
      // Force rollup to use the browser variant of `debug`.
      // The main variant of `debug` relies on Node.js globals.
      alias({
        debug: path.resolve(__dirname, 'node_modules/debug/src/browser'),
      }),

      // Allow rollup to resolve modules that are npm dependencies
      // (by default, it can only resolve local modules).
      resolve(),

      // Allow rollup to resolve npm dependencies that are CommonJS
      // (by default, it can only handle ES2015 syntax).
      commonjs({
        exclude: [`packages/${pkgName}/src/**`],

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

      // Replace `process.env.NODE_ENV` with its value -- needed for
      // some modules like React to use their production variant (and
      // one place within Slate itself).
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      // Use babel to transpile the result -- limit to package src
      // to prevent babel from trying to transpile npm dependencies.
      babel({
        include: [`packages/${pkgName}/src/**`]
      }),
    ]
  }

  // Additional UMD minified build based off of the unminified config
  const umdConfigMin = cloneDeep(umdConfig)
  umdConfigMin.output.file = `packages/${pkgName}/${output.umdMin}`
  umdConfigMin.plugins.push(uglify())

  // CommonJS (for Node) and ES module (for bundlers) build.
  const moduleConfig = {
    input: `packages/${pkgName}/src/index.js`,
    output: [
      {
        file: `packages/${pkgName}/${output.es}`,
        format: 'es',
        sourcemap: environment === 'development',
      },
      {
        file: `packages/${pkgName}/${output.cjs}`,
        format: 'cjs',
        exports: 'named',
      },
    ],
    external: isExternalDependency,
    plugins: [
      // Force rollup to use the browser variant of `debug`.
      // The main variant of `debug` relies on Node.js globals.
      alias({
        debug: path.resolve(__dirname, 'node_modules/debug/src/browser'),
      }),

      // Allow rollup to resolve modules that are npm dependencies
      // (by default, it can only resolve local modules).
      resolve(),

      // Replace `process.env.NODE_ENV` with its value -- needed for
      // some modules like React to use their production variant (and
      // one place within Slate itself).
      replace({
        'process.env.NODE_ENV': JSON.stringify(environment)
      }),

      // Use babel to transpile the result -- limit to package src
      // to prevent babel from trying to transpile npm dependencies.
      babel({
        include: [`packages/${pkgName}/src/**`]
      }),
    ]
  }

  const configurations = [moduleConfig]

  if (environment === 'production') {
    // In development, we only build the module version to
    // reduce rebuild times. In production, we add the
    // configs for the UMD variants here.
    configurations.push(umdConfig, umdConfigMin)
  }

  return configurations
}
