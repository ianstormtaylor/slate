import { Descendant, Node } from '../interfaces/node'
import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSplitNodeOperation,
} from '../interfaces/operation'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import {
  clearQueuedBatchNormalize,
  getQueuedBatchNormalize,
  isObservingBatchNormalize,
  isReadingBatchInternals,
  isWritingBatchInternals,
  withInternalBatchReads,
  withObservedBatchNormalize,
} from './batch'
import {
  clearLiveInsertMoveBatch,
  clearLiveMergeBatch,
  clearLiveMoveBatch,
  clearLiveSplitBatch,
  flushLiveInsertMoveBatch,
  flushLiveMergeBatch,
  flushLiveMoveBatch,
  flushLiveSplitBatch,
  hasLiveInsertMoveBatch,
  hasLiveMergeBatch,
  hasLiveMoveBatch,
  hasLiveSplitBatch,
} from './batching/live-dirty-paths'
import {
  BATCH_DRAFT_CHILDREN,
  BATCH_DEPTH,
  BATCH_INSERT_NODE_OPS,
  BATCH_INSERT_NODE_PARENT_PATH,
  BATCH_INSERT_NODE_SNAPSHOT,
  BATCH_INSERT_NODE_SNAPSHOT_OPS,
  BATCH_EXACT_SET_NODE_OPS,
  BATCH_EXACT_SET_NODE_SNAPSHOT,
  BATCH_EXACT_SET_NODE_SNAPSHOT_OPS,
  BATCH_MERGE_NODE_BASE,
  BATCH_MERGE_NODE_OPS,
  BATCH_MERGE_NODE_PARENT_INDEXES,
  BATCH_MERGE_NODE_SNAPSHOT,
  BATCH_MERGE_NODE_SNAPSHOT_OPS,
  BATCH_SPLIT_NODE_BASE,
  BATCH_SPLIT_NODE_OPS,
  BATCH_SPLIT_NODE_PARENT_INDEXES,
  BATCH_SPLIT_NODE_SNAPSHOT,
  BATCH_SPLIT_NODE_SNAPSHOT_OPS,
  BATCH_TEXT_OPS,
  BATCH_TEXT_SNAPSHOT,
  BATCH_TEXT_SNAPSHOT_OPS,
  CHILDREN,
  DIRTY_PATH_KEYS,
  DIRTY_PATHS,
} from '../utils/weak-maps'
import {
  applySetNodeBatchToChildren,
  validateExactSetNodeOperation,
} from './batching/exact-set-node-children'
import { applyDirectTextMergeBatchToChildren } from './batching/direct-text-merge-batch-children'
import { applyDirectTextSplitBatchToChildren } from './batching/direct-text-split-batch-children'
import { applyInsertNodeBatchToChildren } from './batching/same-parent-insert-node-children'
import { applyTextBatchToChildren } from './batching/text-batch-children'

type TextBatchOperation = BaseInsertTextOperation | BaseRemoveTextOperation

const getCurrentChildren = (editor: Editor): Descendant[] =>
  hasInsertNodeDraft(editor)
    ? materializeInsertNodeDraft(editor)
    : hasTextDraft(editor)
    ? materializeTextDraft(editor)
    : hasMergeNodeDraft(editor)
    ? materializeMergeNodeDraft(editor)
    : hasSplitNodeDraft(editor)
    ? materializeSplitNodeDraft(editor)
    : hasExactSetNodeDraft(editor)
    ? materializeExactSetNodeDraft(editor)
    : hasDraftChildren(editor)
    ? getDraftChildren(editor)
    : getCommittedChildren(editor)

const getObservedChildren = (editor: Editor): Descendant[] => {
  const children = getCurrentChildren(editor)
  const normalizeOptions = getQueuedBatchNormalize(editor)

  if (
    !isBatching(editor) ||
    !normalizeOptions ||
    !Editor.isNormalizing(editor)
  ) {
    return children
  }

  if (hasLiveInsertMoveBatch(editor)) {
    flushLiveInsertMoveBatch(editor)
  }

  if (hasLiveMergeBatch(editor)) {
    flushLiveMergeBatch(editor)
  }

  if (hasLiveMoveBatch(editor)) {
    flushLiveMoveBatch(editor)
  }

  if (hasLiveSplitBatch(editor)) {
    flushLiveSplitBatch(editor)
  }

  // A batch read is an observation barrier. Normalize the live draft in place
  // so later ops continue from replay-equivalent structure, and so internal
  // normalize ops still flow through editor.apply wrappers.
  let shouldForce = normalizeOptions.force
  let operation = normalizeOptions.operation

  do {
    withObservedBatchNormalize(editor, () => {
      Editor.normalize(editor, {
        force: shouldForce,
        operation,
      })
    })

    flushLiveInsertMoveBatch(editor)
    flushLiveMergeBatch(editor)
    flushLiveMoveBatch(editor)
    flushLiveSplitBatch(editor)

    shouldForce = false
    operation = undefined
  } while ((DIRTY_PATHS.get(editor)?.length ?? 0) > 0)

  clearQueuedBatchNormalize(editor)

  return getCurrentChildren(editor)
}

export const getChildren = (editor: Editor): Descendant[] =>
  isReadingBatchInternals(editor) || isObservingBatchNormalize(editor)
    ? getCurrentChildren(editor)
    : getObservedChildren(editor)

export const getCommittedChildren = (editor: Editor): Descendant[] =>
  CHILDREN.get(editor) ?? []

export const setChildren = (editor: Editor, children: Descendant[]) => {
  clearInsertNodeDraft(editor)
  clearTextDraft(editor)
  clearMergeNodeDraft(editor)
  clearSplitNodeDraft(editor)
  clearExactSetNodeDraft(editor)

  if (isBatching(editor)) {
    if (!isWritingBatchInternals(editor)) {
      clearLiveInsertMoveBatch(editor)
      clearLiveMergeBatch(editor)
      clearLiveMoveBatch(editor)
      clearLiveSplitBatch(editor)
      clearQueuedBatchNormalize(editor)
      DIRTY_PATHS.delete(editor)
      DIRTY_PATH_KEYS.delete(editor)
      editor.operations = []
    }

    BATCH_DRAFT_CHILDREN.set(editor, children)
    return
  }

  clearLiveInsertMoveBatch(editor)
  clearLiveMergeBatch(editor)
  clearLiveMoveBatch(editor)
  clearLiveSplitBatch(editor)
  clearDraftChildren(editor)
  DIRTY_PATHS.delete(editor)
  DIRTY_PATH_KEYS.delete(editor)
  editor.operations = []
  CHILDREN.set(editor, children)
}

export const hasDraftChildren = (editor: Editor) =>
  BATCH_DRAFT_CHILDREN.has(editor)

export const getDraftChildren = (editor: Editor): Descendant[] =>
  BATCH_DRAFT_CHILDREN.get(editor) ?? []

export const setDraftChildren = (editor: Editor, children: Descendant[]) => {
  clearInsertNodeDraft(editor)
  clearTextDraft(editor)
  clearMergeNodeDraft(editor)
  clearSplitNodeDraft(editor)
  clearExactSetNodeDraft(editor)
  BATCH_DRAFT_CHILDREN.set(editor, children)
}

export const clearDraftChildren = (editor: Editor) => {
  BATCH_DRAFT_CHILDREN.delete(editor)
}

export const hasInsertNodeDraft = (editor: Editor) =>
  (BATCH_INSERT_NODE_OPS.get(editor)?.length ?? 0) > 0

export const canStageInsertNodeOperation = (
  editor: Editor,
  op: BaseInsertNodeOperation
) => {
  const ops = BATCH_INSERT_NODE_OPS.get(editor)

  if (!ops) {
    return true
  }

  const parentPath =
    BATCH_INSERT_NODE_PARENT_PATH.get(editor) ?? Path.parent(ops[0].path)

  return Path.equals(Path.parent(op.path), parentPath)
}

export const stageInsertNodeOperation = (
  editor: Editor,
  op: BaseInsertNodeOperation
) => {
  const ops = BATCH_INSERT_NODE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_INSERT_NODE_OPS.set(editor, [op])
  BATCH_INSERT_NODE_PARENT_PATH.set(editor, Path.parent(op.path))
}

export const getInsertNodeDraftOps = (editor: Editor) => [
  ...(BATCH_INSERT_NODE_OPS.get(editor) ?? []),
]

export const materializeInsertNodeDraft = (editor: Editor): Descendant[] => {
  const ops = BATCH_INSERT_NODE_OPS.get(editor) ?? []
  const snapshot = BATCH_INSERT_NODE_SNAPSHOT.get(editor)
  const snapshotOps = BATCH_INSERT_NODE_SNAPSHOT_OPS.get(editor) ?? 0

  if (ops.length === 0) {
    return getCommittedChildren(editor)
  }

  if (snapshot && snapshotOps === ops.length) {
    return snapshot
  }

  const baseChildren = snapshot ?? getCommittedChildren(editor)
  const nextChildren = applyInsertNodeBatchToChildren(
    baseChildren,
    ops.slice(snapshotOps)
  )

  BATCH_INSERT_NODE_SNAPSHOT.set(editor, nextChildren)
  BATCH_INSERT_NODE_SNAPSHOT_OPS.set(editor, ops.length)

  return nextChildren
}

export const promoteInsertNodeDraftToDraftChildren = (editor: Editor) => {
  if (!hasInsertNodeDraft(editor)) {
    return
  }

  setDraftChildren(editor, materializeInsertNodeDraft(editor))
}

export const commitInsertNodeDraft = (editor: Editor) => {
  if (!hasInsertNodeDraft(editor)) {
    return
  }

  CHILDREN.set(editor, materializeInsertNodeDraft(editor))
  clearInsertNodeDraft(editor)
}

export const clearInsertNodeDraft = (editor: Editor) => {
  BATCH_INSERT_NODE_OPS.delete(editor)
  BATCH_INSERT_NODE_PARENT_PATH.delete(editor)
  BATCH_INSERT_NODE_SNAPSHOT.delete(editor)
  BATCH_INSERT_NODE_SNAPSHOT_OPS.delete(editor)
}

export const hasTextDraft = (editor: Editor) =>
  (BATCH_TEXT_OPS.get(editor)?.length ?? 0) > 0

export const stageTextOperation = (editor: Editor, op: TextBatchOperation) => {
  const ops = BATCH_TEXT_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_TEXT_OPS.set(editor, [op])
}

export const materializeTextDraft = (editor: Editor): Descendant[] => {
  const ops = BATCH_TEXT_OPS.get(editor) ?? []
  const snapshot = BATCH_TEXT_SNAPSHOT.get(editor)
  const snapshotOps = BATCH_TEXT_SNAPSHOT_OPS.get(editor) ?? 0

  if (ops.length === 0) {
    return getCommittedChildren(editor)
  }

  if (snapshot && snapshotOps === ops.length) {
    return snapshot
  }

  const baseChildren = snapshot ?? getCommittedChildren(editor)
  const nextChildren = applyTextBatchToChildren(
    baseChildren,
    ops.slice(snapshotOps)
  )

  BATCH_TEXT_SNAPSHOT.set(editor, nextChildren)
  BATCH_TEXT_SNAPSHOT_OPS.set(editor, ops.length)

  return nextChildren
}

export const promoteTextDraftToDraftChildren = (editor: Editor) => {
  if (!hasTextDraft(editor)) {
    return
  }

  setDraftChildren(editor, materializeTextDraft(editor))
}

export const applyTextOperationToDraftChildren = (
  editor: Editor,
  op: TextBatchOperation
) => {
  if (!hasDraftChildren(editor)) {
    return
  }

  const children = getDraftChildren(editor)
  const nextChildren = applyTextBatchToChildren(children, [op])

  if (nextChildren !== children) {
    setDraftChildren(editor, nextChildren)
  }
}

export const commitTextDraft = (editor: Editor) => {
  if (!hasTextDraft(editor)) {
    return
  }

  CHILDREN.set(editor, materializeTextDraft(editor))
  clearTextDraft(editor)
}

export const clearTextDraft = (editor: Editor) => {
  BATCH_TEXT_OPS.delete(editor)
  BATCH_TEXT_SNAPSHOT.delete(editor)
  BATCH_TEXT_SNAPSHOT_OPS.delete(editor)
}

export const hasMergeNodeDraft = (editor: Editor) =>
  (BATCH_MERGE_NODE_OPS.get(editor)?.length ?? 0) > 0

export const canStageMergeNodeOperation = (
  editor: Editor,
  op: BaseMergeNodeOperation
) => {
  if (op.path.length !== 2 || !Path.hasPrevious(op.path)) {
    return false
  }

  const [node, prevNode] = withInternalBatchReads(editor, () => {
    const prevPath = Path.previous(op.path)
    return [Node.get(editor, op.path), Node.get(editor, prevPath)]
  })

  if (!Node.isText(node) || !Node.isText(prevNode)) {
    return false
  }

  const parentIndexes = BATCH_MERGE_NODE_PARENT_INDEXES.get(editor)

  return !parentIndexes || !parentIndexes.has(op.path[0])
}

export const stageMergeNodeOperation = (
  editor: Editor,
  op: BaseMergeNodeOperation
) => {
  const ops = BATCH_MERGE_NODE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    BATCH_MERGE_NODE_PARENT_INDEXES.get(editor)?.add(op.path[0])
    return
  }

  BATCH_MERGE_NODE_BASE.set(editor, getCurrentChildren(editor))
  clearDraftChildren(editor)
  BATCH_MERGE_NODE_OPS.set(editor, [op])
  BATCH_MERGE_NODE_PARENT_INDEXES.set(editor, new Set([op.path[0]]))
}

export const materializeMergeNodeDraft = (editor: Editor): Descendant[] => {
  const ops = BATCH_MERGE_NODE_OPS.get(editor) ?? []
  const baseChildren =
    BATCH_MERGE_NODE_BASE.get(editor) ?? getCommittedChildren(editor)
  const snapshot = BATCH_MERGE_NODE_SNAPSHOT.get(editor)
  const snapshotOps = BATCH_MERGE_NODE_SNAPSHOT_OPS.get(editor) ?? 0

  if (ops.length === 0) {
    return baseChildren
  }

  if (snapshot && snapshotOps === ops.length) {
    return snapshot
  }

  const nextChildren = applyDirectTextMergeBatchToChildren(
    snapshot ?? baseChildren,
    ops.slice(snapshotOps)
  )

  BATCH_MERGE_NODE_SNAPSHOT.set(editor, nextChildren)
  BATCH_MERGE_NODE_SNAPSHOT_OPS.set(editor, ops.length)

  return nextChildren
}

export const promoteMergeNodeDraftToDraftChildren = (editor: Editor) => {
  if (!hasMergeNodeDraft(editor)) {
    return
  }

  setDraftChildren(editor, materializeMergeNodeDraft(editor))
}

export const commitMergeNodeDraft = (editor: Editor) => {
  if (!hasMergeNodeDraft(editor)) {
    return
  }

  CHILDREN.set(editor, materializeMergeNodeDraft(editor))
  clearMergeNodeDraft(editor)
}

export const clearMergeNodeDraft = (editor: Editor) => {
  BATCH_MERGE_NODE_BASE.delete(editor)
  BATCH_MERGE_NODE_OPS.delete(editor)
  BATCH_MERGE_NODE_PARENT_INDEXES.delete(editor)
  BATCH_MERGE_NODE_SNAPSHOT.delete(editor)
  BATCH_MERGE_NODE_SNAPSHOT_OPS.delete(editor)
}

export const hasSplitNodeDraft = (editor: Editor) =>
  (BATCH_SPLIT_NODE_OPS.get(editor)?.length ?? 0) > 0

export const canStageSplitNodeOperation = (
  editor: Editor,
  op: BaseSplitNodeOperation
) => {
  if (op.path.length !== 2) {
    return false
  }

  const node = withInternalBatchReads(editor, () => Node.get(editor, op.path))

  if (!Node.isText(node)) {
    return false
  }

  const parentIndexes = BATCH_SPLIT_NODE_PARENT_INDEXES.get(editor)

  return !parentIndexes || !parentIndexes.has(op.path[0])
}

export const stageSplitNodeOperation = (
  editor: Editor,
  op: BaseSplitNodeOperation
) => {
  const ops = BATCH_SPLIT_NODE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    BATCH_SPLIT_NODE_PARENT_INDEXES.get(editor)?.add(op.path[0])
    return
  }

  BATCH_SPLIT_NODE_BASE.set(editor, getCurrentChildren(editor))
  clearDraftChildren(editor)
  BATCH_SPLIT_NODE_OPS.set(editor, [op])
  BATCH_SPLIT_NODE_PARENT_INDEXES.set(editor, new Set([op.path[0]]))
}

export const materializeSplitNodeDraft = (editor: Editor): Descendant[] => {
  const ops = BATCH_SPLIT_NODE_OPS.get(editor) ?? []
  const baseChildren =
    BATCH_SPLIT_NODE_BASE.get(editor) ?? getCommittedChildren(editor)
  const snapshot = BATCH_SPLIT_NODE_SNAPSHOT.get(editor)
  const snapshotOps = BATCH_SPLIT_NODE_SNAPSHOT_OPS.get(editor) ?? 0

  if (ops.length === 0) {
    return baseChildren
  }

  if (snapshot && snapshotOps === ops.length) {
    return snapshot
  }

  const nextChildren = applyDirectTextSplitBatchToChildren(
    snapshot ?? baseChildren,
    ops.slice(snapshotOps)
  )

  BATCH_SPLIT_NODE_SNAPSHOT.set(editor, nextChildren)
  BATCH_SPLIT_NODE_SNAPSHOT_OPS.set(editor, ops.length)

  return nextChildren
}

export const promoteSplitNodeDraftToDraftChildren = (editor: Editor) => {
  if (!hasSplitNodeDraft(editor)) {
    return
  }

  setDraftChildren(editor, materializeSplitNodeDraft(editor))
}

export const commitSplitNodeDraft = (editor: Editor) => {
  if (!hasSplitNodeDraft(editor)) {
    return
  }

  CHILDREN.set(editor, materializeSplitNodeDraft(editor))
  clearSplitNodeDraft(editor)
}

export const clearSplitNodeDraft = (editor: Editor) => {
  BATCH_SPLIT_NODE_BASE.delete(editor)
  BATCH_SPLIT_NODE_OPS.delete(editor)
  BATCH_SPLIT_NODE_PARENT_INDEXES.delete(editor)
  BATCH_SPLIT_NODE_SNAPSHOT.delete(editor)
  BATCH_SPLIT_NODE_SNAPSHOT_OPS.delete(editor)
}

export const hasExactSetNodeDraft = (editor: Editor) =>
  (BATCH_EXACT_SET_NODE_OPS.get(editor)?.length ?? 0) > 0

export const stageExactSetNodeOperation = (
  editor: Editor,
  op: BaseSetNodeOperation
) => {
  validateExactSetNodeOperation(op)

  const ops = BATCH_EXACT_SET_NODE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_EXACT_SET_NODE_OPS.set(editor, [op])
}

export const materializeExactSetNodeDraft = (editor: Editor): Descendant[] => {
  const ops = BATCH_EXACT_SET_NODE_OPS.get(editor) ?? []
  const snapshot = BATCH_EXACT_SET_NODE_SNAPSHOT.get(editor)
  const snapshotOps = BATCH_EXACT_SET_NODE_SNAPSHOT_OPS.get(editor) ?? 0

  if (ops.length === 0) {
    return getCommittedChildren(editor)
  }

  if (snapshot && snapshotOps === ops.length) {
    return snapshot
  }

  const baseChildren = snapshot ?? getCommittedChildren(editor)
  const nextChildren = applySetNodeBatchToChildren(
    baseChildren,
    ops.slice(snapshotOps)
  )

  BATCH_EXACT_SET_NODE_SNAPSHOT.set(editor, nextChildren)
  BATCH_EXACT_SET_NODE_SNAPSHOT_OPS.set(editor, ops.length)

  return nextChildren
}

export const promoteExactSetNodeDraftToDraftChildren = (editor: Editor) => {
  if (!hasExactSetNodeDraft(editor)) {
    return
  }

  setDraftChildren(editor, materializeExactSetNodeDraft(editor))
}

export const commitExactSetNodeDraft = (editor: Editor) => {
  if (!hasExactSetNodeDraft(editor)) {
    return
  }

  CHILDREN.set(editor, materializeExactSetNodeDraft(editor))
  clearExactSetNodeDraft(editor)
}

export const commitDraftChildren = (editor: Editor) => {
  if (hasDraftChildren(editor)) {
    CHILDREN.set(editor, getDraftChildren(editor))
    clearDraftChildren(editor)
    return
  }

  if (hasInsertNodeDraft(editor)) {
    commitInsertNodeDraft(editor)
    return
  }

  if (hasTextDraft(editor)) {
    commitTextDraft(editor)
    return
  }

  if (hasMergeNodeDraft(editor)) {
    commitMergeNodeDraft(editor)
    return
  }

  if (hasSplitNodeDraft(editor)) {
    commitSplitNodeDraft(editor)
    return
  }

  commitExactSetNodeDraft(editor)
}

export const clearExactSetNodeDraft = (editor: Editor) => {
  BATCH_EXACT_SET_NODE_OPS.delete(editor)
  BATCH_EXACT_SET_NODE_SNAPSHOT.delete(editor)
  BATCH_EXACT_SET_NODE_SNAPSHOT_OPS.delete(editor)
}

export const defineChildrenAccessor = (editor: Editor) => {
  Object.defineProperty(editor, 'children', {
    configurable: true,
    enumerable: true,
    get() {
      return getChildren(editor)
    },
    set(children: Descendant[]) {
      setChildren(editor, children)
    },
  })
}

export const isBatching = (editor: Editor) => (BATCH_DEPTH.get(editor) ?? 0) > 0
