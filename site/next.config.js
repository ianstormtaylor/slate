const fs = require('node:fs')
const path = require('node:path')

const SITE_ROOT = __dirname
const REPO_ROOT = path.resolve(SITE_ROOT, '..')
const PACKAGES_ROOT = path.join(REPO_ROOT, 'packages')

const toSiteImportPath = (targetPath) => {
  const relativePath = path
    .relative(SITE_ROOT, targetPath)
    .replaceAll('\\', '/')

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

const getIndexEntry = (dir) => {
  const tsEntry = path.join(dir, 'index.ts')
  const tsxEntry = path.join(dir, 'index.tsx')

  if (fs.existsSync(tsEntry)) return tsEntry
  if (fs.existsSync(tsxEntry)) return tsxEntry

  return null
}

const buildWorkspaceSourceAliases = (mapper) => {
  const aliases = {}

  for (const entry of fs.readdirSync(PACKAGES_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue

    const rootEntry = getIndexEntry(path.join(PACKAGES_ROOT, entry.name, 'src'))

    if (!rootEntry) continue

    aliases[entry.name] = mapper(rootEntry)
  }

  return aliases
}

/**
 * @type {import('next').NextConfig}
 */
const turbopackSourceAliases = buildWorkspaceSourceAliases(toSiteImportPath)
const webpackSourceAliases = buildWorkspaceSourceAliases(
  (targetPath) => targetPath
)

const nextConfig = {
  output: 'export',
  turbopack: {
    root: path.join(__dirname, '..'),
    resolveAlias: turbopackSourceAliases,
  },
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...webpackSourceAliases,
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.d\.ts$/,
      })
    )
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      exclude: [/node_modules[\\/]@next/, /node_modules[\\/]next/],
      use: [
        {
          loader: require.resolve('source-map-loader'),
        },
      ],
    })
    return config
  },
  // https://answers.netlify.com/t/basic-nextjs-website-failing-to-build-with-exit-code-129/120273/2
  experimental: {
    cpus: 1,
    externalDir: true,
  },
}

module.exports = nextConfig
