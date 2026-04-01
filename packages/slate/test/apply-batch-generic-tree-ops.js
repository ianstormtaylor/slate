import assert from 'assert'
import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const section = texts => ({
  type: 'section',
  children: texts.map(text => paragraph(text)),
})

const TREE_OP_SCENARIOS = [
  {
    id: 'sameParentInsert',
    children: [paragraph('one'), paragraph('four')],
    ops: [
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('two'),
      },
      {
        type: 'insert_node',
        path: [2],
        node: paragraph('three'),
      },
    ],
  },
  {
    id: 'sameParentInsertEmptyDocument',
    children: [],
    ops: [
      {
        type: 'insert_node',
        path: [0],
        node: paragraph('zero'),
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('one'),
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('between'),
      },
      {
        type: 'insert_node',
        path: [3],
        node: paragraph('three'),
      },
    ],
  },
  {
    id: 'sameParentInsertDirtyPaths',
    children: [paragraph('one'), paragraph('four')],
    ops: [
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('two'),
      },
      {
        type: 'insert_node',
        path: [2],
        node: paragraph('three'),
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'sameParentInsertNonMonotonicDirtyPaths',
    children: [],
    ops: [
      {
        type: 'insert_node',
        path: [0],
        node: paragraph('zero'),
      },
      {
        type: 'insert_node',
        path: [0],
        node: paragraph('before-zero'),
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('between'),
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'nestedSameParentInsert',
    children: [section(['one', 'four'])],
    ops: [
      {
        type: 'insert_node',
        path: [0, 1],
        node: paragraph('two'),
      },
      {
        type: 'insert_node',
        path: [0, 2],
        node: paragraph('three'),
      },
    ],
  },
  {
    id: 'nestedSameParentInsertDirtyPaths',
    children: [section(['one', 'four'])],
    ops: [
      {
        type: 'insert_node',
        path: [0, 1],
        node: paragraph('two'),
      },
      {
        type: 'insert_node',
        path: [0, 2],
        node: paragraph('three'),
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'interleavedInsertMove',
    children: [],
    ops: [
      {
        type: 'insert_node',
        path: [0],
        node: paragraph('zero'),
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('one'),
      },
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'insert_node',
        path: [2],
        node: paragraph('two'),
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
    ],
  },
  {
    id: 'interleavedInsertMoveDirtyPaths',
    children: [],
    ops: [
      {
        type: 'insert_node',
        path: [0],
        node: paragraph('zero'),
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('one'),
      },
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'insert_node',
        path: [2],
        node: paragraph('two'),
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'singleInsert',
    children: [paragraph('one'), paragraph('three')],
    ops: [
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('two'),
      },
    ],
  },
  {
    id: 'removeNode',
    children: [paragraph('one'), paragraph('two'), paragraph('three')],
    ops: [
      {
        type: 'remove_node',
        path: [1],
        node: paragraph('two'),
      },
    ],
  },
  {
    id: 'moveNode',
    children: [paragraph('one'), paragraph('two')],
    ops: [
      {
        type: 'move_node',
        path: [0],
        newPath: [1],
      },
    ],
  },
  {
    id: 'moveNodeBatch',
    children: [
      paragraph('zero'),
      paragraph('one'),
      paragraph('two'),
      paragraph('three'),
    ],
    ops: [
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [3],
        newPath: [0],
      },
    ],
  },
  {
    id: 'moveNodeBatchDirtyPaths',
    children: [
      paragraph('zero'),
      paragraph('one'),
      paragraph('two'),
      paragraph('three'),
    ],
    ops: [
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [3],
        newPath: [0],
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'mixedSameParentMoveBatch',
    children: [paragraph('a'), paragraph('b'), paragraph('c'), paragraph('d')],
    ops: [
      {
        type: 'move_node',
        path: [2],
        newPath: [1],
      },
      {
        type: 'move_node',
        path: [0],
        newPath: [3],
      },
    ],
  },
  {
    id: 'mixedSameParentMoveBatchDirtyPaths',
    children: [paragraph('a'), paragraph('b'), paragraph('c'), paragraph('d')],
    ops: [
      {
        type: 'move_node',
        path: [2],
        newPath: [1],
      },
      {
        type: 'move_node',
        path: [0],
        newPath: [3],
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'moveNodeSelection',
    children: [
      paragraph('zero'),
      paragraph('one'),
      paragraph('two'),
      paragraph('three'),
    ],
    selection: {
      anchor: { path: [1, 0], offset: 1 },
      focus: { path: [2, 0], offset: 2 },
    },
    ops: [
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [3],
        newPath: [0],
      },
    ],
  },
  {
    id: 'mixedSetNodeMove',
    children: [
      paragraph('zero'),
      paragraph('one'),
      paragraph('two'),
      paragraph('three'),
    ],
    ops: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'zero' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'one' },
      },
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
    ],
  },
  {
    id: 'mixedSetNodeMoveDirtyPaths',
    children: [
      paragraph('zero'),
      paragraph('one'),
      paragraph('two'),
      paragraph('three'),
    ],
    ops: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'zero' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'one' },
      },
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'mergeNode',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'one ' }, { text: 'two' }],
      },
    ],
    ops: [
      {
        type: 'merge_node',
        path: [0, 1],
        position: 4,
        properties: {},
      },
    ],
  },
  {
    id: 'mergeNodeDirtyPaths',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'one ' }, { text: 'two' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'three ' }, { text: 'four' }],
      },
    ],
    ops: [
      {
        type: 'merge_node',
        path: [0, 1],
        position: 4,
        properties: {},
      },
      {
        type: 'merge_node',
        path: [1, 1],
        position: 6,
        properties: {},
      },
    ],
    compareDirtyPaths: true,
  },
  {
    id: 'splitNode',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'before text' }, { text: 'after text' }],
      },
    ],
    ops: [
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: { type: 'paragraph' },
      },
    ],
  },
  {
    id: 'splitNodeDirtyPaths',
    children: [paragraph('one'), paragraph('two')],
    ops: [
      {
        type: 'split_node',
        path: [0, 0],
        position: 1,
        properties: {},
      },
      {
        type: 'split_node',
        path: [1, 0],
        position: 1,
        properties: {},
      },
    ],
    compareDirtyPaths: true,
  },
]

const TREE_OP_SCENARIOS_BY_ID = new Map(
  TREE_OP_SCENARIOS.map(scenario => [scenario.id, scenario])
)

const TREE_OP_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: TREE_OP_SCENARIOS.map(scenario => scenario.id),
})

const TREE_OP_OBSERVATION_SCENARIOS = [
  {
    scenario: 'sameParentInsert',
    persistRefPath: [0],
  },
  {
    scenario: 'nestedSameParentInsert',
    persistRefPath: [0],
  },
  {
    scenario: 'moveNodeBatch',
    persistRefPath: [0],
  },
  {
    scenario: 'interleavedInsertMove',
  },
  {
    scenario: 'mergeNode',
    persistRefPath: [0],
  },
  {
    scenario: 'splitNode',
    persistRefPath: [0],
  },
]

const TREE_OP_OBSERVATION_MATRIX = TREE_OP_OBSERVATION_SCENARIOS.flatMap(
  ({ scenario, persistRefPath }) =>
    createMatrixCases({
      batchEntry: ['applyBatch', 'manualWithBatch'],
      wrapperMode: ['plain', 'transparent'],
      observationMode: ['readAfterEach', 'persistRef'],
    })
      .filter(
        matrixCase =>
          matrixCase.observationMode !== 'persistRef' || persistRefPath
      )
      .map(matrixCase => ({
        ...matrixCase,
        scenario,
        persistRefPath,
        name: `scenario=${scenario} | ${matrixCase.name}`,
      }))
)

const TREE_OP_REWRITE_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  observationMode: ['none', 'readAfterEach', 'persistRef'],
}).map(matrixCase => ({
  ...matrixCase,
  scenario: 'mixedSetNodeMove',
  persistRefPath: matrixCase.observationMode === 'persistRef' ? [0] : null,
  wrapperMode: 'rewrite',
  name: `scenario=mixedSetNodeMove | batchEntry=${matrixCase.batchEntry} | wrapperMode=rewrite | observationMode=${matrixCase.observationMode}`,
}))

describe('Transforms.applyBatch generic tree ops', () => {
  it('declares the generic-tree-op matrix manifest', () => {
    assertBatchMatrixManifest('genericTreeOps', TREE_OP_MATRIX.length)
  })

  for (const matrixCase of TREE_OP_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = TREE_OP_SCENARIOS_BY_ID.get(matrixCase.scenario)

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        selection: scenario.selection,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: 'plain',
        observationMode: 'none',
        compareDirtyPaths: scenario.compareDirtyPaths,
        compareOperations: !scenario.compareDirtyPaths,
      })
    })
  }

  it('declares the generic-tree-op observation matrix manifest', () => {
    assertBatchMatrixManifest(
      'genericTreeOpsObservation',
      TREE_OP_OBSERVATION_MATRIX.length
    )
  })

  for (const matrixCase of TREE_OP_OBSERVATION_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = TREE_OP_SCENARIOS_BY_ID.get(matrixCase.scenario)

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        selection: scenario.selection,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath: matrixCase.persistRefPath,
      })
    })
  }

  it('declares the generic-tree-op rewrite matrix manifest', () => {
    assertBatchMatrixManifest(
      'genericTreeOpsRewrite',
      TREE_OP_REWRITE_MATRIX.length
    )
  })

  for (const matrixCase of TREE_OP_REWRITE_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = TREE_OP_SCENARIOS_BY_ID.get(matrixCase.scenario)

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        selection: scenario.selection,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath: matrixCase.persistRefPath,
      })
    })
  }
})
