import assert from 'assert'
import { createEditor } from '../src'
import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'
import { withHistory } from '../../slate-history/src'
import { withReact } from '../../slate-react/src'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const createHistoryReactEditor = () => withReact(withHistory(createEditor()))

const WRAPPER_STACK_SCENARIOS = {
  mixedStructural: {
    children: [paragraph('one'), paragraph('two')],
    ops: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('middle'),
      },
    ],
    assertHistory(editor, wrapperMode) {
      assert.equal(editor.history.undos.length, 1)
      assert.deepEqual(editor.history.undos[0].operations, [
        {
          type: 'set_node',
          path: [0],
          properties: {},
          newProperties: { id: wrapperMode === 'rewrite' ? 'orange' : 'a' },
        },
        {
          type: 'insert_node',
          path: [1],
          node: paragraph('middle'),
        },
      ])
    },
  },
  mixedTextSelectionNode: {
    children: [paragraph('abcd')],
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
        newProperties: { id: 'p0' },
      },
    ],
    assertHistory(editor, wrapperMode) {
      assert.equal(editor.history.undos.length, 1)
      assert.deepEqual(editor.history.undos[0].operations, [
        {
          type: 'insert_text',
          path: [0, 0],
          offset: 1,
          text: 'X',
        },
        {
          type: 'set_node',
          path: [0],
          properties: {},
          newProperties: {
            id: wrapperMode === 'rewrite' ? 'orange' : 'p0',
          },
        },
      ])
      assert.deepEqual(editor.history.undos[0].selectionBefore, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      })
    },
  },
}

const WRAPPER_STACK_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  wrapperMode: ['plain', 'rewrite'],
  observationMode: ['none', 'readAfterEach', 'persistRef'],
  scenario: Object.keys(WRAPPER_STACK_SCENARIOS),
})

describe('Transforms.applyBatch wrapper stacks', () => {
  it('declares the wrapper-stack matrix manifest', () => {
    assertBatchMatrixManifest('wrapperStacks', WRAPPER_STACK_MATRIX.length)
  })

  for (const matrixCase of WRAPPER_STACK_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = WRAPPER_STACK_SCENARIOS[matrixCase.scenario]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        selection: scenario.selection,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        persistRefPath:
          matrixCase.observationMode === 'persistRef' ? [0] : null,
        createBatchEditor: createHistoryReactEditor,
        createReplayEditor: createHistoryReactEditor,
        assertResult: ({ batchEditor }) => {
          scenario.assertHistory(batchEditor, matrixCase.wrapperMode)
        },
      })
    })
  }
})
