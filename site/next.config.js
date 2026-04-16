const fs = require('node:fs')
const path = require('node:path')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

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
module.exports = async (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  return {
    output: 'export',
    turbopack: isDev
      ? {
          root: path.join(__dirname, '..'),
          resolveAlias: turbopackSourceAliases,
        }
      : undefined,
    // https://answers.netlify.com/t/basic-nextjs-website-failing-to-build-with-exit-code-129/120273/2
    experimental: {
      cpus: 1,
      externalDir: isDev,
    },
  }
}
