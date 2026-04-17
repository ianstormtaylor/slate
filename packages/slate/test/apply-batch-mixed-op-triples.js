import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const paragraphWithTexts = (...texts) => ({
  type: 'paragraph',
  children: texts.map(text => ({ text })),
})

const MIXED_OP_TRIPLE_SCENARIOS = {
  setNodeThenMoveNodeThenMergeNode: {
    children: [
      paragraphWithTexts('aa', 'bb'),
      paragraphWithTexts('cc', 'dd'),
      paragraph('ee'),
      paragraph('ff'),
    ],
    ops: [
      {
        type: 'set_node',
        path: [2],
        properties: {},
        newProperties: { id: 'c0' },
      },
      {
        type: 'move_node',
        path: [3],
        newPath: [2],
      },
      {
        type: 'merge_node',
        path: [0, 1],
        position: 2,
        properties: {},
      },
    ],
    persistRefPath: [2],
  },
  setNodeThenMoveNodeThenSplitNode: {
    children: [
      paragraph('aa'),
      paragraph('bb'),
      paragraph('cc'),
      paragraph('dd'),
    ],
    ops: [
      {
        type: 'set_node',
        path: [2],
        properties: {},
        newProperties: { id: 'c0' },
      },
      {
        type: 'move_node',
        path: [3],
        newPath: [2],
      },
      {
        type: 'split_node',
        path: [0, 0],
        position: 1,
        properties: {},
      },
    ],
    persistRefPath: [2],
  },
  setNodeThenInsertNodeThenMoveNode: {
    children: [
      paragraph('aa'),
      paragraph('bb'),
      paragraph('cc'),
      paragraph('dd'),
    ],
    ops: [
      {
        type: 'set_node',
        path: [2],
        properties: {},
        newProperties: { id: 'c0' },
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('middle'),
      },
      {
        type: 'move_node',
        path: [4],
        newPath: [2],
      },
    ],
    persistRefPath: [2],
  },
  insertNodeThenMoveNodeThenSplitNode: {
    children: [
      paragraph('aa'),
      paragraph('bb'),
      paragraph('cc'),
      paragraph('dd'),
    ],
    ops: [
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('middle'),
      },
      {
        type: 'move_node',
        path: [4],
        newPath: [2],
      },
      {
        type: 'split_node',
        path: [0, 0],
        position: 1,
        properties: {},
      },
    ],
    persistRefPath: [2],
  },
}

const MIXED_OP_TRIPLE_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: Object.keys(MIXED_OP_TRIPLE_SCENARIOS),
})

const MIXED_OP_TRIPLE_OBSERVATION_MATRIX = Object.entries(
  MIXED_OP_TRIPLE_SCENARIOS
).flatMap(([scenario, config]) =>
  createMatrixCases({
    batchEntry: ['applyBatch', 'manualWithBatch'],
    wrapperMode: ['plain', 'rewrite'],
    observationMode: ['readAfterEach', 'persistRef'],
  }).map(matrixCase => ({
    ...matrixCase,
    scenario,
    persistRefPath:
      matrixCase.observationMode === 'persistRef'
        ? config.persistRefPath
        : null,
    name: `scenario=${scenario} | ${matrixCase.name}`,
  }))
)

describe('Transforms.applyBatch mixed op triples', () => {
  it('declares the mixed-op triple matrix manifest', () => {
    assertBatchMatrixManifest('mixedOpTriples', MIXED_OP_TRIPLE_MATRIX.length)
  })

  for (const matrixCase of MIXED_OP_TRIPLE_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = MIXED_OP_TRIPLE_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: 'plain',
        observationMode: 'none',
        compareOperations: false,
      })
    })
  }

  it('declares the mixed-op triple observation matrix manifest', () => {
    assertBatchMatrixManifest(
      'mixedOpTriplesObservation',
      MIXED_OP_TRIPLE_OBSERVATION_MATRIX.length
    )
  })

  for (const matrixCase of MIXED_OP_TRIPLE_OBSERVATION_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = MIXED_OP_TRIPLE_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath: matrixCase.persistRefPath,
        compareOperations: false,
      })
    })
  }
})
