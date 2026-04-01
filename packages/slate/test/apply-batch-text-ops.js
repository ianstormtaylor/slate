import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const TEXT_OP_SCENARIOS = {
  duplicateInsertText: {
    children: [{ type: 'paragraph', children: [{ text: 'abcd' }] }],
    ops: [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 1,
        text: 'X',
      },
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 3,
        text: 'Y',
      },
    ],
    persistRefPath: [0, 0],
  },
  mixedTextOps: {
    children: [{ type: 'paragraph', children: [{ text: 'abcdef' }] }],
    ops: [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 2,
        text: 'X',
      },
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'b',
      },
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 0,
        text: 'Z',
      },
    ],
    persistRefPath: [0, 0],
  },
}

const TEXT_OP_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: Object.keys(TEXT_OP_SCENARIOS),
  wrapperMode: ['plain', 'rewriteText'],
  observationMode: ['none', 'readAfterEach', 'persistRef'],
})

describe('Transforms.applyBatch text ops', () => {
  it('declares the text-op matrix manifest', () => {
    assertBatchMatrixManifest('textOps', TEXT_OP_MATRIX.length)
  })

  for (const matrixCase of TEXT_OP_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = TEXT_OP_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath:
          matrixCase.observationMode === 'persistRef'
            ? scenario.persistRefPath
            : null,
      })
    })
  }
})
