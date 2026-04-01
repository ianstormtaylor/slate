import assert from 'assert'
import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const paragraphWithTexts = (...texts) => ({
  type: 'paragraph',
  children: texts.map(text => ({ text })),
})

const BASE_CHILDREN = [
  paragraphWithTexts('aa', 'bb'),
  paragraphWithTexts('ab', 'cd'),
  paragraph('cc'),
  paragraph('dd'),
]

const OP_FAMILIES = [
  'setNode',
  'insertNode',
  'removeNode',
  'moveNode',
  'mergeNode',
  'splitNode',
  'insertText',
  'removeText',
  'setSelection',
]

const capitalize = value => value[0].toUpperCase() + value.slice(1)

const getPairScenarioId = (firstFamily, secondFamily) =>
  `${firstFamily}Then${capitalize(secondFamily)}`

const getTopLevelCountAfterFirstFamily = firstFamily => {
  switch (firstFamily) {
    case 'insertNode':
    case 'splitNode':
      return 5
    case 'removeNode':
      return 3
    default:
      return 4
  }
}

const FIRST_OP_FACTORIES = {
  setNode: () => ({
    type: 'set_node',
    path: [2],
    properties: {},
    newProperties: { id: 'c0' },
  }),
  insertNode: () => ({
    type: 'insert_node',
    path: [2],
    node: paragraph('xx'),
  }),
  removeNode: () => ({
    type: 'remove_node',
    path: [2],
    node: paragraph('cc'),
  }),
  moveNode: () => ({
    type: 'move_node',
    path: [3],
    newPath: [2],
  }),
  mergeNode: () => ({
    type: 'merge_node',
    path: [0, 1],
    position: 2,
    properties: {},
  }),
  splitNode: () => ({
    type: 'split_node',
    path: [2],
    position: 1,
    properties: { type: 'paragraph' },
  }),
  insertText: () => ({
    type: 'insert_text',
    path: [1, 0],
    offset: 1,
    text: 'X',
  }),
  removeText: () => ({
    type: 'remove_text',
    path: [1, 0],
    offset: 0,
    text: 'a',
  }),
  setSelection: () => ({
    type: 'set_selection',
    properties: null,
    newProperties: {
      anchor: { path: [2, 0], offset: 1 },
      focus: { path: [2, 0], offset: 2 },
    },
  }),
}

const SECOND_OP_FACTORIES = {
  setNode: () => ({
    type: 'set_node',
    path: [0],
    properties: {},
    newProperties: { id: 'a0' },
  }),
  insertNode: firstFamily => ({
    type: 'insert_node',
    path: [getTopLevelCountAfterFirstFamily(firstFamily)],
    node: paragraph('yy'),
  }),
  removeNode: () => ({
    type: 'remove_node',
    path: [0],
    node: paragraphWithTexts('aa', 'bb'),
  }),
  moveNode: firstFamily => ({
    type: 'move_node',
    path: [getTopLevelCountAfterFirstFamily(firstFamily) - 1],
    newPath: [0],
  }),
  mergeNode: firstFamily => ({
    type: 'merge_node',
    path: [0, 1],
    position: 2,
    properties: {},
  }),
  splitNode: () => ({
    type: 'split_node',
    path: [0],
    position: 1,
    properties: { type: 'paragraph' },
  }),
  insertText: () => ({
    type: 'insert_text',
    path: [1, 0],
    offset: 1,
    text: 'Y',
  }),
  removeText: () => ({
    type: 'remove_text',
    path: [1, 0],
    offset: 0,
    text: 'a',
  }),
  setSelection: () => ({
    type: 'set_selection',
    properties: null,
    newProperties: {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 2 },
    },
  }),
}

const isOperationOrderStable = (firstFamily, secondFamily) =>
  firstFamily !== 'splitNode' &&
  secondFamily !== 'splitNode' &&
  firstFamily !== 'insertText' &&
  firstFamily !== 'removeText'

const MIXED_OP_PAIR_SCENARIOS = Object.fromEntries(
  OP_FAMILIES.flatMap(firstFamily =>
    OP_FAMILIES.filter(secondFamily => secondFamily !== firstFamily).map(
      secondFamily => [
        getPairScenarioId(firstFamily, secondFamily),
        {
          children: BASE_CHILDREN,
          ops: [
            FIRST_OP_FACTORIES[firstFamily](),
            SECOND_OP_FACTORIES[secondFamily](firstFamily),
          ],
          compareOperations: isOperationOrderStable(firstFamily, secondFamily),
        },
      ]
    )
  )
)

const MIXED_OP_PAIR_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: Object.keys(MIXED_OP_PAIR_SCENARIOS),
})

const MIXED_OP_PAIR_OBSERVATION_SCENARIOS = {
  setNodeThenInsertNode: {
    observationModes: ['readAfterEach', 'persistRef'],
    persistRefPath: [2],
    wrapperModes: ['plain', 'rewrite'],
  },
  insertNodeThenMoveNode: {
    observationModes: ['readAfterEach'],
    persistRefPath: null,
    wrapperModes: ['plain', 'transparent'],
  },
  mergeNodeThenSetSelection: {
    observationModes: ['readAfterEach', 'persistRef'],
    persistRefPath: [0],
    wrapperModes: ['plain', 'transparent'],
  },
  splitNodeThenSetSelection: {
    observationModes: ['readAfterEach', 'persistRef'],
    persistRefPath: [2],
    wrapperModes: ['plain', 'transparent'],
  },
  insertTextThenMoveNode: {
    observationModes: ['readAfterEach', 'persistRef'],
    persistRefPath: [1],
    wrapperModes: ['plain', 'transparent'],
  },
  moveNodeThenRemoveText: {
    observationModes: ['readAfterEach'],
    persistRefPath: null,
    wrapperModes: ['plain', 'transparent'],
  },
}

const MIXED_OP_PAIR_OBSERVATION_MATRIX = Object.entries(
  MIXED_OP_PAIR_OBSERVATION_SCENARIOS
).flatMap(([scenario, config]) =>
  createMatrixCases({
    batchEntry: ['applyBatch', 'manualWithBatch'],
    observationMode: config.observationModes,
    wrapperMode: config.wrapperModes,
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

describe('Transforms.applyBatch mixed op pairs', () => {
  it('declares the mixed-op pair matrix manifest', () => {
    assertBatchMatrixManifest('mixedOpPairs', MIXED_OP_PAIR_MATRIX.length)
  })

  for (const matrixCase of MIXED_OP_PAIR_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = MIXED_OP_PAIR_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: 'plain',
        observationMode: 'none',
        compareOperations: scenario.compareOperations,
      })
    })
  }

  it('declares the mixed-op pair observation matrix manifest', () => {
    assertBatchMatrixManifest(
      'mixedOpPairsObservation',
      MIXED_OP_PAIR_OBSERVATION_MATRIX.length
    )
  })

  for (const matrixCase of MIXED_OP_PAIR_OBSERVATION_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = MIXED_OP_PAIR_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath: matrixCase.persistRefPath,
        compareOperations: scenario.compareOperations,
      })
    })
  }
})
