import assert from 'assert'
import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'

const GENERIC_OP_SCENARIOS = {
  insertText: {
    children: [{ type: 'paragraph', children: [{ text: 'one' }] }],
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
  },
  removeText: {
    children: [{ type: 'paragraph', children: [{ text: 'abcd' }] }],
    ops: [
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'b',
      },
      {
        type: 'remove_text',
        path: [0, 0],
        offset: 1,
        text: 'c',
      },
    ],
  },
  setSelection: {
    children: [{ type: 'paragraph', children: [{ text: 'abcd' }] }],
    ops: [
      {
        type: 'set_selection',
        properties: null,
        newProperties: {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 0], offset: 1 },
        },
      },
      {
        type: 'set_selection',
        properties: {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 0], offset: 1 },
        },
        newProperties: {
          focus: { path: [0, 0], offset: 3 },
        },
      },
    ],
  },
  mixedTextSelectionNode: {
    children: [{ type: 'paragraph', children: [{ text: 'abcd' }] }],
    selection: {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    },
    ops: [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 1,
        text: 'X',
      },
      {
        type: 'set_selection',
        properties: {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        },
        newProperties: {
          anchor: { path: [0, 0], offset: 2 },
          focus: { path: [0, 0], offset: 2 },
        },
      },
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'blue' },
      },
    ],
  },
}

const GENERIC_OP_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: Object.keys(GENERIC_OP_SCENARIOS),
})

describe('Transforms.applyBatch generic ops', () => {
  it('declares the generic-op matrix manifest', () => {
    assertBatchMatrixManifest('genericOps', GENERIC_OP_MATRIX.length)
  })

  for (const matrixCase of GENERIC_OP_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = GENERIC_OP_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        selection: scenario.selection,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: 'plain',
        observationMode: 'none',
      })
    })
  }
})
