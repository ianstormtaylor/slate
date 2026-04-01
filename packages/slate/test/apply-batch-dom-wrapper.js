import assert from 'assert'
import { createEditor, Editor } from '../src'
import { createMatrixCases, runBatchReplayCase } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'
import {
  DOMEditor,
  EDITOR_TO_PENDING_DIFFS,
  EDITOR_TO_PENDING_SELECTION,
  IS_NODE_MAP_DIRTY,
  withDOM,
} from '../../slate-dom/src'
import { withHistory } from '../../slate-history/src'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const createDOMEditor = () => withDOM(createEditor())
const createDOMHistoryEditor = () => withDOM(withHistory(createEditor()))

const DOM_EDITOR_FACTORIES = {
  dom: createDOMEditor,
  domHistory: createDOMHistoryEditor,
}

const DOM_WRAPPER_SCENARIOS = {
  pendingSelectionMoveNode: {
    children: [paragraph('zero'), paragraph('one'), paragraph('two')],
    ops: [
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
    ],
    setup(editor) {
      EDITOR_TO_PENDING_SELECTION.set(editor, {
        anchor: { path: [1, 0], offset: 1 },
        focus: { path: [1, 0], offset: 2 },
      })
    },
    assertResult({ batchEditor, replayEditor }) {
      assert.deepEqual(
        EDITOR_TO_PENDING_SELECTION.get(batchEditor),
        EDITOR_TO_PENDING_SELECTION.get(replayEditor)
      )
      assert.equal(IS_NODE_MAP_DIRTY.get(batchEditor), true)
      assert.equal(IS_NODE_MAP_DIRTY.get(replayEditor), true)
    },
  },
  pendingDiffsInsertText: {
    children: [paragraph('abcd')],
    ops: [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 0,
        text: 'Z',
      },
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 2,
        text: 'Y',
      },
    ],
    setup(editor) {
      EDITOR_TO_PENDING_DIFFS.set(editor, [
        {
          id: 1,
          path: [0, 0],
          diff: {
            start: 1,
            end: 3,
            text: 'xy',
          },
        },
      ])
    },
    assertResult({ batchEditor, replayEditor }) {
      assert.deepEqual(
        EDITOR_TO_PENDING_DIFFS.get(batchEditor),
        EDITOR_TO_PENDING_DIFFS.get(replayEditor)
      )
      assert.equal(IS_NODE_MAP_DIRTY.get(batchEditor), true)
      assert.equal(IS_NODE_MAP_DIRTY.get(replayEditor), true)
    },
  },
  setNodeKeyStability: {
    children: [paragraph('one'), paragraph('two')],
    ops: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'p0' },
      },
    ],
    setup(editor) {
      return {
        beforeKeyId: DOMEditor.findKey(editor, editor.children[0]).id,
      }
    },
    assertResult({
      batchEditor,
      replayEditor,
      batchSetupResult,
      replaySetupResult,
    }) {
      assert.equal(
        DOMEditor.findKey(batchEditor, batchEditor.children[0]).id,
        batchSetupResult.beforeKeyId
      )
      assert.equal(
        DOMEditor.findKey(replayEditor, replayEditor.children[0]).id,
        replaySetupResult.beforeKeyId
      )
    },
  },
  moveNodeKeyStability: {
    children: [paragraph('zero'), paragraph('one'), paragraph('two')],
    ops: [
      {
        type: 'move_node',
        path: [1],
        newPath: [0],
      },
      {
        type: 'move_node',
        path: [2],
        newPath: [1],
      },
    ],
    setup(editor) {
      return {
        movedKeyId: DOMEditor.findKey(editor, editor.children[1]).id,
      }
    },
    assertResult({
      batchEditor,
      replayEditor,
      batchSetupResult,
      replaySetupResult,
    }) {
      assert.equal(
        DOMEditor.findKey(batchEditor, batchEditor.children[0]).id,
        batchSetupResult.movedKeyId
      )
      assert.equal(
        DOMEditor.findKey(replayEditor, replayEditor.children[0]).id,
        replaySetupResult.movedKeyId
      )
      assert.equal(IS_NODE_MAP_DIRTY.get(batchEditor), true)
      assert.equal(IS_NODE_MAP_DIRTY.get(replayEditor), true)
    },
  },
}

const DOM_WRAPPER_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  editorMode: ['dom', 'domHistory'],
  observationMode: ['none', 'readAfterEach', 'persistRef'],
  scenario: Object.keys(DOM_WRAPPER_SCENARIOS),
})

describe('Transforms.applyBatch DOM wrapper state', () => {
  it('declares the DOM wrapper matrix manifest', () => {
    assertBatchMatrixManifest('domWrapper', DOM_WRAPPER_MATRIX.length)
  })

  for (const matrixCase of DOM_WRAPPER_MATRIX) {
    it(matrixCase.name, () => {
      const scenario = DOM_WRAPPER_SCENARIOS[matrixCase.scenario]
      const createEditorForMode = DOM_EDITOR_FACTORIES[matrixCase.editorMode]

      runBatchReplayCase({
        children: scenario.children,
        ops: scenario.ops,
        batchEntry: matrixCase.batchEntry,
        wrapperMode: 'plain',
        observationMode: matrixCase.observationMode,
        persistRefPath:
          matrixCase.observationMode === 'persistRef' ? [0] : null,
        createBatchEditor: createEditorForMode,
        createReplayEditor: createEditorForMode,
        setupBatchEditor: scenario.setup,
        setupReplayEditor: scenario.setup,
        assertResult: scenario.assertResult,
      })
    })
  }

  const DIRECT_ASSIGNMENT_EDITOR_CASES = {
    dom: createDOMEditor,
    domHistory: createDOMHistoryEditor,
  }

  for (const [editorMode, createEditorForMode] of Object.entries(
    DIRECT_ASSIGNMENT_EDITOR_CASES
  )) {
    it(`clears stale DOM pending state after direct children assignment in batch | editorMode=${editorMode}`, () => {
      const editor = createEditorForMode()

      editor.children = [paragraph('zero'), paragraph('one'), paragraph('two')]

      EDITOR_TO_PENDING_SELECTION.set(editor, {
        anchor: { path: [2, 0], offset: 1 },
        focus: { path: [2, 0], offset: 1 },
      })
      EDITOR_TO_PENDING_DIFFS.set(editor, [
        {
          id: 1,
          path: [2, 0],
          diff: { start: 0, end: 1, text: 'x' },
        },
      ])

      Editor.withBatch(editor, () => {
        editor.apply({
          type: 'move_node',
          path: [2],
          newPath: [0],
        })
        editor.children = [paragraph('replacement')]
      })

      assert.equal(EDITOR_TO_PENDING_SELECTION.has(editor), false)
      assert.equal(EDITOR_TO_PENDING_DIFFS.has(editor), false)
      assert.equal(IS_NODE_MAP_DIRTY.get(editor), true)
    })
  }
})
