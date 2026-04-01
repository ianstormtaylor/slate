import assert from 'assert'
import { createEditor, Editor, Transforms } from '../src'
import { createMatrixCases, deepClone } from './utils/batch-matrix'
import { assertBatchMatrixManifest } from './utils/batch-matrix-manifest'
import {
  getCommittedChildren,
  hasDraftChildren,
  hasExactSetNodeDraft,
  hasInsertNodeDraft,
} from '../src/core/children'

const paragraph = text => ({ type: 'paragraph', children: [{ text }] })

const paragraphWithTexts = (...texts) => ({
  type: 'paragraph',
  children: texts.map(text => ({ text })),
})

const INVALID_ROOT_SET_NODE_OP = {
  type: 'set_node',
  path: [],
  properties: {},
  newProperties: { id: 'root' },
}

const FAILURE_SCENARIOS = {
  exactSetNode: {
    children: [paragraph('one')],
    prefixOps: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'p0' },
      },
    ],
  },
  insertNode: {
    children: [paragraph('one')],
    prefixOps: [
      {
        type: 'insert_node',
        path: [1],
        node: paragraph('two'),
      },
    ],
  },
  moveNode: {
    children: [paragraph('one'), paragraph('two'), paragraph('three')],
    prefixOps: [
      {
        type: 'move_node',
        path: [2],
        newPath: [0],
      },
    ],
  },
  splitNode: {
    children: [paragraphWithTexts('ab', 'cd')],
    prefixOps: [
      {
        type: 'split_node',
        path: [0],
        position: 1,
        properties: { type: 'paragraph' },
      },
    ],
  },
  mergeNode: {
    children: [paragraphWithTexts('one', 'two')],
    prefixOps: [
      {
        type: 'merge_node',
        path: [0, 1],
        position: 3,
        properties: {},
      },
    ],
  },
  mixedTextSelectionNode: {
    children: [paragraph('one')],
    prefixOps: [
      {
        type: 'set_selection',
        properties: null,
        newProperties: {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [0, 0], offset: 1 },
        },
      },
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
        newProperties: { id: 'p0' },
      },
    ],
  },
}

const FAILURE_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: Object.keys(FAILURE_SCENARIOS),
})

const flushMicrotasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

const assertNoDraftLeak = editor => {
  assert.equal(hasDraftChildren(editor), false)
  assert.equal(hasExactSetNodeDraft(editor), false)
  assert.equal(hasInsertNodeDraft(editor), false)
}

const applyFailureBatch = (editor, batchEntry, prefixOps) => {
  if (batchEntry === 'applyBatch') {
    Transforms.applyBatch(editor, [
      ...deepClone(prefixOps),
      INVALID_ROOT_SET_NODE_OP,
    ])
    return
  }

  if (batchEntry === 'manualWithBatch') {
    Editor.withBatch(editor, () => {
      for (const op of deepClone(prefixOps)) {
        editor.apply(op)
      }

      editor.apply(INVALID_ROOT_SET_NODE_OP)
    })
    return
  }

  throw new Error(`Unsupported batch entry: ${batchEntry}`)
}

describe('Editor.withBatch failure semantics', () => {
  it('commits direct children assignment that happened before a later batch error', () => {
    const editor = createEditor()
    const replacement = [paragraph('replacement')]

    editor.children = [paragraph('one')]

    assert.throws(() => {
      Editor.withBatch(editor, () => {
        editor.children = replacement
        throw new Error('boom')
      })
    }, /boom/)

    assert.strictEqual(editor.children, replacement)
    assert.strictEqual(getCommittedChildren(editor), replacement)
    assertNoDraftLeak(editor)
  })
})

describe('Transforms.applyBatch failure semantics', () => {
  it('declares the failure-semantics matrix manifest', () => {
    assertBatchMatrixManifest('failureSemantics', FAILURE_MATRIX.length)
  })

  for (const matrixCase of FAILURE_MATRIX) {
    it(matrixCase.name, async () => {
      const scenario = FAILURE_SCENARIOS[matrixCase.scenario]
      const editor = createEditor()
      const replayEditor = createEditor()
      let onChangeCount = 0

      editor.children = deepClone(scenario.children)
      replayEditor.children = deepClone(scenario.children)
      editor.onChange = () => {
        onChangeCount++
      }

      for (const op of deepClone(scenario.prefixOps)) {
        replayEditor.apply(op)
      }

      assert.throws(() => {
        applyFailureBatch(editor, matrixCase.batchEntry, scenario.prefixOps)
      }, /Cannot set properties on the root node!/)

      assert.deepEqual(editor.children, replayEditor.children)
      assert.deepEqual(editor.selection, replayEditor.selection)
      assert.deepEqual(getCommittedChildren(editor), editor.children)
      assertNoDraftLeak(editor)
      assert.equal(onChangeCount, 0)

      await flushMicrotasks()

      assert.equal(onChangeCount, 1)
      assert.deepEqual(editor.operations, [])
    })
  }
})
