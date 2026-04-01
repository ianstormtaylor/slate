const assert = require('assert')

const BATCH_MATRIX_MANIFEST = {
  exactSetNode: {
    count: 48,
    file: 'packages/slate/test/apply-batch-exact-set-node.js',
  },
  genericOps: {
    count: 8,
    file: 'packages/slate/test/apply-batch-generic-ops.js',
  },
  textOps: {
    count: 36,
    file: 'packages/slate/test/apply-batch-text-ops.js',
  },
  genericTreeOps: {
    count: 46,
    file: 'packages/slate/test/apply-batch-generic-tree-ops.js',
  },
  genericTreeOpsObservation: {
    count: 52,
    file: 'packages/slate/test/apply-batch-generic-tree-ops.js',
  },
  genericTreeOpsRewrite: {
    count: 6,
    file: 'packages/slate/test/apply-batch-generic-tree-ops.js',
  },
  mixedOpPairs: {
    count: 144,
    file: 'packages/slate/test/apply-batch-mixed-op-pairs.js',
  },
  mixedOpPairsObservation: {
    count: 40,
    file: 'packages/slate/test/apply-batch-mixed-op-pairs.js',
  },
  mixedOpTriples: {
    count: 8,
    file: 'packages/slate/test/apply-batch-mixed-op-triples.js',
  },
  mixedOpTriplesObservation: {
    count: 32,
    file: 'packages/slate/test/apply-batch-mixed-op-triples.js',
  },
  failureSemantics: {
    count: 60,
    file: 'packages/slate/test/apply-batch-failure-semantics.js',
  },
  domWrapper: {
    count: 48,
    file: 'packages/slate/test/apply-batch-dom-wrapper.js',
  },
  wrapperStacks: {
    count: 48,
    file: 'packages/slate/test/apply-batch-wrapper-stacks.js',
  },
  directAssignment: {
    count: 16,
    file: 'packages/slate/test/with-batch-direct-assignment.js',
  },
  directAssignmentObservation: {
    count: 4,
    file: 'packages/slate/test/with-batch-direct-assignment.js',
  },
  historyBatchCases: {
    count: 4,
    file: 'packages/slate-history/test/apply-batch-exact-set-node.js',
  },
  historyBatchEntries: {
    count: 8,
    file: 'packages/slate-history/test/apply-batch-exact-set-node.js',
  },
}

const assertBatchMatrixManifest = (id, actualCount) => {
  const manifest = BATCH_MATRIX_MANIFEST[id]

  assert.ok(manifest, `Unknown batch matrix manifest id: ${id}`)
  assert.ok(
    Number.isInteger(actualCount) && actualCount > 0,
    `Manifest ${id} must produce a positive integer count`
  )
  assert.equal(actualCount, manifest.count)
}

module.exports = {
  BATCH_MATRIX_MANIFEST,
  assertBatchMatrixManifest,
}
