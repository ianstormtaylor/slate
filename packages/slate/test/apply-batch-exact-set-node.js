import assert from 'assert'
import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const createFlatChildren = () => [
  { type: 'paragraph', children: [{ text: 'one' }] },
  { type: 'paragraph', children: [{ text: 'two' }] },
  { type: 'paragraph', children: [{ text: 'three' }] },
]

const createNestedChildren = () => [
  {
    type: 'section',
    children: [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
    ],
  },
]

const getPathsForShape = (documentShape, targetShape) => {
  if (documentShape === 'flat') {
    return targetShape === 'duplicate'
      ? { first: [0], second: [0] }
      : { first: [0], second: [2] }
  }

  return targetShape === 'duplicate'
    ? { first: [0, 0], second: [0, 0] }
    : { first: [0, 0], second: [0, 2] }
}

const createOps = (documentShape, targetShape) => {
  const paths = getPathsForShape(documentShape, targetShape)

  if (targetShape === 'duplicate') {
    return [
      {
        type: 'set_node',
        path: paths.first,
        properties: {},
        newProperties: { id: 'blue' },
      },
      {
        type: 'set_node',
        path: paths.second,
        properties: {},
        newProperties: { id: 'final', role: 'final' },
      },
    ]
  }

  return [
    {
      type: 'set_node',
      path: paths.first,
      properties: {},
      newProperties: { id: 'blue' },
    },
    {
      type: 'set_node',
      path: paths.second,
      properties: {},
      newProperties: { id: 'green' },
    },
  ]
}

const EXACT_SET_NODE_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  wrapperMode: ['plain', 'rewrite'],
  observationMode: ['none', 'readAfterEach', 'persistRef'],
  documentShape: ['flat', 'nested'],
  targetShape: ['unique', 'duplicate'],
})

describe('Transforms.applyBatch exact-path set_node', () => {
  it('declares the exact-set-node matrix manifest', () => {
    assertBatchMatrixManifest('exactSetNode', EXACT_SET_NODE_MATRIX.length)
  })

  for (const matrixCase of EXACT_SET_NODE_MATRIX) {
    it(matrixCase.name, () => {
      const children =
        matrixCase.documentShape === 'flat'
          ? createFlatChildren()
          : createNestedChildren()
      const paths = getPathsForShape(
        matrixCase.documentShape,
        matrixCase.targetShape
      )

      runBatchReplayCase({
        children,
        ops: createOps(matrixCase.documentShape, matrixCase.targetShape),
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath: paths.first,
      })
    })
  }
})
