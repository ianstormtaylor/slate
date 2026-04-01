import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { BATCH_MATRIX_MANIFEST } from './utils/batch-matrix-manifest'

const REPO_ROOT = path.resolve(__dirname, '../../..')
const MATRIX_TEST_DIRECTORIES = [
  'packages/slate/test',
  'packages/slate-history/test',
  'packages/slate-react/test',
]
const MATRIX_HELPER_CALL_PATTERN =
  /assertBatchMatrixManifest\(\s*['"]([^'"]+)['"]/g

const walkFiles = directory => {
  const files = []

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
      continue
    }

    if (/\.(js|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

const normalizePath = filePath =>
  path.relative(REPO_ROOT, filePath).split(path.sep).join('/')

const discoverManifestCalls = () =>
  MATRIX_TEST_DIRECTORIES.flatMap(directory =>
    walkFiles(path.join(REPO_ROOT, directory)).flatMap(filePath => {
      const relativePath = normalizePath(filePath)
      const source = fs.readFileSync(filePath, 'utf8')
      const ids = [...source.matchAll(MATRIX_HELPER_CALL_PATTERN)].map(
        match => match[1]
      )

      return ids.map(id => ({ file: relativePath, id }))
    })
  )

describe('batch matrix manifest registry', () => {
  it('tracks every declared matrix manifest id exactly once', () => {
    const manifestEntries = Object.entries(BATCH_MATRIX_MANIFEST)
    const manifestIds = manifestEntries.map(([id]) => id)
    const discoveredCalls = discoverManifestCalls()
    const discoveredIds = discoveredCalls.map(call => call.id)

    assert.equal(new Set(manifestIds).size, manifestIds.length)
    assert.equal(new Set(discoveredIds).size, discoveredIds.length)
    assert.deepEqual([...manifestIds].sort(), [...discoveredIds].sort())
  })

  it('keeps manifest files aligned with helper usage', () => {
    const discoveredCalls = discoverManifestCalls()
    const discoveredFilesById = Object.fromEntries(
      discoveredCalls.map(call => [call.id, call.file])
    )
    const manifestFiles = new Set()
    const discoveredFiles = new Set(discoveredCalls.map(call => call.file))

    for (const [id, manifest] of Object.entries(BATCH_MATRIX_MANIFEST)) {
      const manifestFilePath = path.join(REPO_ROOT, manifest.file)

      assert.ok(fs.existsSync(manifestFilePath), `Missing manifest file: ${id}`)
      assert.equal(discoveredFilesById[id], manifest.file)
      manifestFiles.add(manifest.file)
    }

    assert.deepEqual([...manifestFiles].sort(), [...discoveredFiles].sort())
  })

  it('keeps declared manifest counts positive', () => {
    for (const [id, manifest] of Object.entries(BATCH_MATRIX_MANIFEST)) {
      assert.ok(
        Number.isInteger(manifest.count) && manifest.count > 0,
        `Manifest ${id} must declare a positive integer count`
      )
    }
  })
})
