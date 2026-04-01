import assert from 'assert'
import { createEditor, Editor, Transforms } from '../../src'
import { DIRTY_PATHS } from '../../src/utils/weak-maps'

export const deepClone = value => JSON.parse(JSON.stringify(value))

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

    if (wrapperMode === 'rewriteText' && op.type === 'insert_text') {
      nextOp = {
        ...op,
        text: `${op.text}!`,
      }
    }

    apply(nextOp)

    if (observationMode === 'readAfterEach') {
      snapshots.push(deepClone(editor.children))
    }
  }
}

const runBatch = (editor, batchEntry, ops) => {
  if (batchEntry === 'applyBatch') {
    Transforms.applyBatch(editor, ops)
    return
  }

  if (batchEntry === 'manualWithBatch') {
    Editor.withBatch(editor, () => {
      for (const op of ops) {
        editor.apply(op)
      }
    })
    return
  }

  throw new Error(`Unsupported batch entry: ${batchEntry}`)
}

export const createMatrixCases = axes => {
  const entries = Object.entries(axes)

  const build = (index, current) => {
    if (index === entries.length) {
      return [
        {
          ...current,
          name: entries.map(([key]) => `${key}=${current[key]}`).join(' | '),
        },
      ]
    }

    const [key, values] = entries[index]

    return values.flatMap(value =>
      build(index + 1, {
        ...current,
        [key]: value,
      })
    )
  }

  return build(0, {})
}

const getDirtyPathKeys = editor =>
  (DIRTY_PATHS.get(editor) ?? []).map(path => path.join(',')).sort()

export const runBatchReplayCase = ({
  children,
  ops,
  batchEntry,
  wrapperMode,
  observationMode,
  selection = null,
  persistRefPath = null,
  compareDirtyPaths = false,
  compareOperations = true,
  createBatchEditor = createEditor,
  createReplayEditor = createEditor,
  setupBatchEditor = null,
  setupReplayEditor = null,
  assertResult = null,
}) => {
  const batchEditor = createBatchEditor()
  const replayEditor = createReplayEditor()
  const batchSnapshots = []
  const replaySnapshots = []

  batchEditor.children = deepClone(children)
  replayEditor.children = deepClone(children)
  batchEditor.selection = selection ? deepClone(selection) : selection
  replayEditor.selection = selection ? deepClone(selection) : selection

  installApplyWrapper(batchEditor, {
    wrapperMode,
    observationMode,
    snapshots: batchSnapshots,
  })
  installApplyWrapper(replayEditor, {
    wrapperMode,
    observationMode,
    snapshots: replaySnapshots,
  })

  const batchSetupResult = setupBatchEditor
    ? setupBatchEditor(batchEditor)
    : null
  const replaySetupResult = setupReplayEditor
    ? setupReplayEditor(replayEditor)
    : null

  const initialBatchRefValue =
    observationMode === 'persistRef' && persistRefPath
      ? deepClone(getNodeAtPath(batchEditor.children, persistRefPath))
      : null
  const initialReplayRefValue =
    observationMode === 'persistRef' && persistRefPath
      ? deepClone(getNodeAtPath(replayEditor.children, persistRefPath))
      : null
  const publishedBatchRef =
    observationMode === 'persistRef' && persistRefPath
      ? getNodeAtPath(batchEditor.children, persistRefPath)
      : null
  const publishedReplayRef =
    observationMode === 'persistRef' && persistRefPath
      ? getNodeAtPath(replayEditor.children, persistRefPath)
      : null

  runBatch(batchEditor, batchEntry, deepClone(ops))

  for (const op of deepClone(ops)) {
    replayEditor.apply(op)
  }

  assert.deepEqual(batchEditor.children, replayEditor.children)
  assert.deepEqual(batchEditor.selection, replayEditor.selection)

  if (compareOperations) {
    assert.deepEqual(batchEditor.operations, replayEditor.operations)
  }

  if (compareDirtyPaths) {
    assert.deepEqual(
      getDirtyPathKeys(batchEditor),
      getDirtyPathKeys(replayEditor)
    )
  }

  if (observationMode === 'readAfterEach') {
    assert.deepEqual(batchSnapshots, replaySnapshots)
  }

  if (observationMode === 'persistRef') {
    assert.deepEqual(publishedBatchRef, initialBatchRefValue)
    assert.deepEqual(publishedReplayRef, initialReplayRefValue)
  }

  if (assertResult) {
    assertResult({
      batchEditor,
      replayEditor,
      batchSetupResult,
      replaySetupResult,
      batchSnapshots,
      replaySnapshots,
    })
  }
}
