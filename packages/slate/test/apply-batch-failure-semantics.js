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
    observationModes: ['none', 'readAfterEach', 'persistRef'],
    persistRefPath: [0],
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
    observationModes: ['none', 'readAfterEach'],
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
    observationModes: ['none', 'readAfterEach', 'persistRef'],
    persistRefPath: [0],
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
    observationModes: ['none', 'readAfterEach'],
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
    observationModes: ['none', 'readAfterEach'],
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
    observationModes: ['none', 'readAfterEach', 'persistRef'],
    persistRefPath: [0],
  },
}

const FAILURE_BASE_MATRIX = createMatrixCases({
  batchEntry: ['applyBatch', 'manualWithBatch'],
  scenario: Object.keys(FAILURE_SCENARIOS),
})

const FAILURE_MATRIX = FAILURE_BASE_MATRIX.flatMap(matrixCase => {
  const scenario = FAILURE_SCENARIOS[matrixCase.scenario]

  return createMatrixCases({
    wrapperMode: ['plain', 'rewrite'],
    observationMode: scenario.observationModes,
  }).map(modeCase => ({
    ...matrixCase,
    ...modeCase,
    persistRefPath:
      modeCase.observationMode === 'persistRef'
        ? scenario.persistRefPath ?? null
        : null,
    name: `${matrixCase.name} | wrapperMode=${modeCase.wrapperMode} | observationMode=${modeCase.observationMode}`,
  }))
})

const flushMicrotasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

const getNodeAtPath = (children, path) => {
  let current = children

  for (const index of path) {
    current = Array.isArray(current) ? current[index] : current.children[index]
  }

  return current
}

const installApplyWrapper = (
  editor,
  { wrapperMode, observationMode, snapshots }
) => {
  if (
    (wrapperMode === 'plain' || wrapperMode == null) &&
    observationMode === 'none'
  ) {
    return
  }

  const { apply } = editor

  editor.apply = op => {
    let nextOp = op

    if (wrapperMode === 'rewrite' && op.type === 'set_node') {
      nextOp = {
        ...op,
        newProperties: {
          ...op.newProperties,
          ...('id' in (op.newProperties ?? {}) ? { id: 'orange' } : {}),
          ...('type' in (op.newProperties ?? {}) ? { type: 'quote' } : {}),
        },
      }
    }

    apply(nextOp)

    if (observationMode === 'readAfterEach') {
      snapshots.push(deepClone(editor.children))
    }
  }
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
      const batchSnapshots = []
      const replaySnapshots = []
      let onChangeCount = 0

      editor.children = deepClone(scenario.children)
      replayEditor.children = deepClone(scenario.children)
      editor.onChange = () => {
        onChangeCount++
      }

      installApplyWrapper(editor, {
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        snapshots: batchSnapshots,
      })
      installApplyWrapper(replayEditor, {
        wrapperMode: matrixCase.wrapperMode,
        observationMode: matrixCase.observationMode,
        snapshots: replaySnapshots,
      })

      const initialBatchRefValue =
        matrixCase.observationMode === 'persistRef' &&
        matrixCase.persistRefPath != null
          ? deepClone(getNodeAtPath(editor.children, matrixCase.persistRefPath))
          : null
      const initialReplayRefValue =
        matrixCase.observationMode === 'persistRef' &&
        matrixCase.persistRefPath != null
          ? deepClone(
              getNodeAtPath(replayEditor.children, matrixCase.persistRefPath)
            )
          : null
      const publishedBatchRef =
        matrixCase.observationMode === 'persistRef' &&
        matrixCase.persistRefPath != null
          ? getNodeAtPath(editor.children, matrixCase.persistRefPath)
          : null
      const publishedReplayRef =
        matrixCase.observationMode === 'persistRef' &&
        matrixCase.persistRefPath != null
          ? getNodeAtPath(replayEditor.children, matrixCase.persistRefPath)
          : null

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

      if (matrixCase.observationMode === 'readAfterEach') {
        assert.deepEqual(batchSnapshots, replaySnapshots)
      }

      if (matrixCase.observationMode === 'persistRef') {
        assert.deepEqual(publishedBatchRef, initialBatchRefValue)
        assert.deepEqual(publishedReplayRef, initialReplayRefValue)
      }

      await flushMicrotasks()

      assert.equal(onChangeCount, 1)
      assert.deepEqual(editor.operations, [])
    })
  }
})
