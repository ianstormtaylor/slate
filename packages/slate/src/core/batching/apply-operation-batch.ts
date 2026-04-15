import { Path } from '../../interfaces/path'
import { WithEditorFirstArg } from '../../utils/types'
import {
  BaseInsertNodeOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseSplitNodeOperation,
  Operation,
} from '../../interfaces/operation'
import { Editor } from '../../interfaces/editor'
import { Node } from '../../interfaces/node'
import {
  finalizeOperation,
  runOperation,
  transformOperationRefs,
  transformOperationSelection,
  transformOperationSelectionPoints,
  transformOperationTree,
  updateOperationDirtyPaths,
} from '../apply-operation'
import {
  canStageSplitNodeOperation,
  canStageInsertNodeOperation,
  canStageMergeNodeOperation,
  clearInsertNodeDraft,
  getChildren,
  getInsertNodeDraftOps,
  hasDraftChildren,
  hasExactSetNodeDraft,
  hasInsertNodeDraft,
  hasMergeNodeDraft,
  hasSplitNodeDraft,
  hasTextDraft,
  promoteExactSetNodeDraftToDraftChildren,
  promoteInsertNodeDraftToDraftChildren,
  promoteMergeNodeDraftToDraftChildren,
  promoteSplitNodeDraftToDraftChildren,
  promoteTextDraftToDraftChildren,
  stageExactSetNodeOperation,
  stageInsertNodeOperation,
  stageMergeNodeOperation,
  stageSplitNodeOperation,
  stageTextOperation,
  applyTextOperationToDraftChildren,
} from '../children'
import {
  canExtendLiveInsertMoveBatch,
  flushLiveInsertMoveBatch,
  flushLiveMergeBatch,
  flushLiveMoveBatch,
  flushLiveSplitBatch,
  getSameParentInsertMoveDirtyPathState,
  getSameParentMoveDirtyPaths,
  hasLiveInsertMoveBatch,
  hasLiveMergeBatch,
  hasLiveMoveBatch,
  hasLiveSplitBatch,
  isMoveNodeBatch as isLiveMoveNodeBatch,
  isSameParentInsertMoveBatch,
  isSameParentMoveBatch as isLiveSameParentMoveBatch,
  stageLiveInsertMoveBatchOperations,
  stageLiveMergeBatchOperation,
  stageLiveMoveBatchOperation,
  stageLiveSplitBatchOperation,
  createSameParentMoveDirtyPathTransform,
} from './live-dirty-paths'
import {
  BatchSegment,
  batchNeedsSegmentPlanning,
  isSameParentInsertBatch,
  segmentOperationBatch,
  shouldPreferWholeBatchExecution,
} from './batch-segments'
import { withInternalBatchReads } from '../batch'
import {
  applyDirtyPathBatchedOperations,
  isBatchingDirtyPaths,
} from './dirty-paths'

// Operation-batch application owns staged draft mutation and dirty-path
// batching once a segment shape has already been chosen by batch-segments.ts.
const getSameParentInsertDirtyPaths = (
  editor: Editor,
  ops: BaseInsertNodeOperation[]
) => {
  const parentPath = Path.parent(ops[0].path)
  const parent = parentPath.length === 0 ? editor : Node.get(editor, parentPath)

  if (!Node.isEditor(parent) && !Node.isElement(parent)) {
    throw new Error(
      `Cannot batch insert_node operations beneath non-container node at path [${parentPath}].`
    )
  }

  const order: Array<Node | null> = new Array(parent.children.length).fill(null)
  const newDirtyPaths: Path[] = []
  const newDirtyPathKeys = new Set<string>()

  const addDirtyPath = (path: Path) => {
    const key = path.join(',')

    if (!newDirtyPathKeys.has(key)) {
      newDirtyPathKeys.add(key)
      newDirtyPaths.push(path)
    }
  }

  for (const op of ops) {
    const targetIndex = op.path[op.path.length - 1]

    if (targetIndex > order.length) {
      throw new Error(
        `Cannot apply an "insert_node" operation at path [${op.path}] because the destination is past the end of the node.`
      )
    }

    order.splice(targetIndex, 0, op.node)
  }

  for (const path of Path.levels(parentPath)) {
    addDirtyPath(path)
  }

  order.forEach((entry, position) => {
    if (entry == null) {
      return
    }

    const node = entry

    const finalPath = parentPath.concat(position)
    addDirtyPath(finalPath)

    if (!Node.isText(node)) {
      for (const [, path] of Node.nodes(node)) {
        addDirtyPath(finalPath.concat(path))
      }
    }
  })

  return newDirtyPaths
}

const applyInsertBatchWithDirtyPathBatching = (
  editor: Editor,
  ops: BaseInsertNodeOperation[]
) => {
  const newDirtyPaths = withInternalBatchReads(editor, () =>
    getSameParentInsertDirtyPaths(editor, ops)
  )

  applyDirtyPathBatchedOperations({ editor, ops, newDirtyPaths })
}

const applyOperationBatchSegment = (editor: Editor, segment: BatchSegment) => {
  switch (segment.kind) {
    case 'same-parent-insert-move': {
      const { newDirtyPaths, transformDirtyPath } = withInternalBatchReads(
        editor,
        () =>
          getSameParentInsertMoveDirtyPathState(
            editor,
            segment.ops as (BaseInsertNodeOperation | BaseMoveNodeOperation)[]
          )
      )

      applyDirtyPathBatchedOperations({
        editor,
        ops: segment.ops,
        newDirtyPaths,
        transformDirtyPath,
      })
      return
    }
    case 'same-parent-insert':
      applyInsertBatchWithDirtyPathBatching(
        editor,
        segment.ops as BaseInsertNodeOperation[]
      )
      return
    case 'same-parent-move':
      applyDirtyPathBatchedOperations({
        editor,
        ops: segment.ops,
        newDirtyPaths: withInternalBatchReads(editor, () =>
          getSameParentMoveDirtyPaths(
            editor,
            segment.ops as BaseMoveNodeOperation[]
          )
        ),
        transformDirtyPath: withInternalBatchReads(editor, () =>
          createSameParentMoveDirtyPathTransform(
            editor,
            segment.ops as BaseMoveNodeOperation[]
          )
        ),
      })
      return
    case 'move':
      for (const op of segment.ops) {
        editor.apply(op)
      }
      return
    case 'generic':
      if (applyWholeBatchFastPath(editor, segment.ops)) {
        return
      }

      for (const op of segment.ops) {
        editor.apply(op)
      }
      return
  }
}

const shouldSkipTextMergeDirtyPaths = (
  editor: Editor,
  op: BaseMergeNodeOperation
) => {
  if (op.path.length === 0 || !Path.hasPrevious(op.path)) {
    return false
  }

  return withInternalBatchReads(editor, () => {
    const prevPath = Path.previous(op.path)

    if (!Editor.hasPath(editor, op.path) || !Editor.hasPath(editor, prevPath)) {
      return false
    }

    const [node] = Editor.node(editor, op.path)
    const [prevNode] = Editor.node(editor, prevPath)

    return Node.isText(node) && Node.isText(prevNode)
  })
}

const flushConflictingLiveBatches = (editor: Editor, op: Operation) => {
  if (
    op.type !== 'insert_node' &&
    op.type !== 'move_node' &&
    hasLiveInsertMoveBatch(editor)
  ) {
    flushLiveInsertMoveBatch(editor)
  }

  if (op.type !== 'merge_node' && hasLiveMergeBatch(editor)) {
    flushLiveMergeBatch(editor)
  }

  if (op.type !== 'split_node' && hasLiveSplitBatch(editor)) {
    flushLiveSplitBatch(editor)
  }

  if (
    op.type !== 'move_node' &&
    (!hasLiveInsertMoveBatch(editor) ||
      !canExtendLiveInsertMoveBatch(editor, op)) &&
    hasLiveMoveBatch(editor)
  ) {
    flushLiveMoveBatch(editor)
  }

  if (
    (op.type === 'insert_node' || op.type === 'move_node') &&
    hasLiveInsertMoveBatch(editor) &&
    !canExtendLiveInsertMoveBatch(editor, op)
  ) {
    flushLiveInsertMoveBatch(editor)
  }

  if (
    op.type === 'insert_node' &&
    hasLiveMoveBatch(editor) &&
    !hasLiveInsertMoveBatch(editor)
  ) {
    flushLiveMoveBatch(editor)
  }
}

const promoteBufferedDraftsToDraftChildren = (editor: Editor) => {
  if (hasExactSetNodeDraft(editor)) {
    promoteExactSetNodeDraftToDraftChildren(editor)
  }

  if (hasTextDraft(editor)) {
    promoteTextDraftToDraftChildren(editor)
  }

  if (hasMergeNodeDraft(editor)) {
    promoteMergeNodeDraftToDraftChildren(editor)
  }

  if (hasInsertNodeDraft(editor)) {
    promoteInsertNodeDraftToDraftChildren(editor)
  }

  if (hasSplitNodeDraft(editor)) {
    promoteSplitNodeDraftToDraftChildren(editor)
  }
}

const promoteDraftsBeforeLiveStructuralOp = (
  editor: Editor,
  options: {
    includeInsert?: boolean
    includeSplit?: boolean
  } = {}
) => {
  if (hasExactSetNodeDraft(editor)) {
    promoteExactSetNodeDraftToDraftChildren(editor)
  }

  if (options.includeInsert && hasInsertNodeDraft(editor)) {
    promoteInsertNodeDraftToDraftChildren(editor)
  }

  if (hasTextDraft(editor)) {
    promoteTextDraftToDraftChildren(editor)
  }

  if (options.includeSplit && hasSplitNodeDraft(editor)) {
    promoteSplitNodeDraftToDraftChildren(editor)
  }
}

const prepareStructuralDraftsForTextOperation = (editor: Editor) => {
  if (
    !hasDraftChildren(editor) &&
    !hasMergeNodeDraft(editor) &&
    !hasSplitNodeDraft(editor)
  ) {
    return
  }

  // A later text op must observe the replay-equivalent leaf layout, which can
  // require queued normalization after split/merge staging.
  getChildren(editor)

  if (hasMergeNodeDraft(editor)) {
    promoteMergeNodeDraftToDraftChildren(editor)
  }

  if (hasSplitNodeDraft(editor)) {
    promoteSplitNodeDraftToDraftChildren(editor)
  }
}

const tryStageTextBatchOperation = (editor: Editor, op: Operation) => {
  if (
    (op.type !== 'insert_text' && op.type !== 'remove_text') ||
    hasExactSetNodeDraft(editor) ||
    hasInsertNodeDraft(editor)
  ) {
    return false
  }

  prepareStructuralDraftsForTextOperation(editor)

  transformOperationRefs(editor, op)
  transformOperationSelection(editor, op)
  updateOperationDirtyPaths(editor, op)

  if (hasDraftChildren(editor)) {
    applyTextOperationToDraftChildren(editor, op)
  } else {
    stageTextOperation(editor, op)
  }

  finalizeOperation(editor, op)
  return true
}

const tryStageExactSetNodeBatchOperation = (editor: Editor, op: Operation) => {
  if (
    op.type !== 'set_node' ||
    hasDraftChildren(editor) ||
    hasInsertNodeDraft(editor) ||
    hasTextDraft(editor)
  ) {
    return false
  }

  transformOperationRefs(editor, op)
  updateOperationDirtyPaths(editor, op)
  stageExactSetNodeOperation(editor, op)
  finalizeOperation(editor, op)

  return true
}

const tryStageInsertBatchOperation = (editor: Editor, op: Operation) => {
  if (
    op.type !== 'insert_node' ||
    hasLiveInsertMoveBatch(editor) ||
    hasDraftChildren(editor) ||
    hasExactSetNodeDraft(editor) ||
    hasTextDraft(editor) ||
    !canStageInsertNodeOperation(editor, op)
  ) {
    return false
  }

  transformOperationRefs(editor, op)
  transformOperationSelectionPoints(editor, op)
  updateOperationDirtyPaths(editor, op)
  stageInsertNodeOperation(editor, op)
  finalizeOperation(editor, op)

  return true
}

const tryStageLiveInsertMoveOperation = (editor: Editor, op: Operation) => {
  if (
    op.type !== 'insert_node' ||
    !hasLiveInsertMoveBatch(editor) ||
    !canExtendLiveInsertMoveBatch(editor, op) ||
    isBatchingDirtyPaths(editor)
  ) {
    return false
  }

  transformOperationRefs(editor, op)
  transformOperationTree(editor, op)
  finalizeOperation(editor, op)
  stageLiveInsertMoveBatchOperations(editor, [op])

  return true
}

const tryStageLiveMergeOperation = (editor: Editor, op: Operation) => {
  if (op.type !== 'merge_node' || isBatchingDirtyPaths(editor)) {
    return false
  }

  const shouldSkipDirtyPaths = shouldSkipTextMergeDirtyPaths(editor, op)

  promoteDraftsBeforeLiveStructuralOp(editor, {
    includeInsert: true,
    includeSplit: true,
  })

  if (canStageMergeNodeOperation(editor, op)) {
    transformOperationRefs(editor, op)
    transformOperationSelectionPoints(editor, op)
    stageMergeNodeOperation(editor, op)
    finalizeOperation(editor, op)

    if (!shouldSkipDirtyPaths) {
      stageLiveMergeBatchOperation(editor, op)
    }

    return true
  }

  if (hasMergeNodeDraft(editor)) {
    promoteMergeNodeDraftToDraftChildren(editor)
  }

  transformOperationRefs(editor, op)
  transformOperationTree(editor, op)
  finalizeOperation(editor, op)

  if (!shouldSkipDirtyPaths) {
    stageLiveMergeBatchOperation(editor, op)
  }

  return true
}

const tryStageLiveSplitOperation = (editor: Editor, op: Operation) => {
  if (op.type !== 'split_node' || isBatchingDirtyPaths(editor)) {
    return false
  }

  promoteDraftsBeforeLiveStructuralOp(editor, { includeInsert: true })

  if (canStageSplitNodeOperation(editor, op)) {
    transformOperationRefs(editor, op)
    transformOperationSelectionPoints(editor, op)
    stageSplitNodeOperation(editor, op)
    finalizeOperation(editor, op)
    stageLiveSplitBatchOperation(editor, op)
    return true
  }

  if (hasSplitNodeDraft(editor)) {
    promoteSplitNodeDraftToDraftChildren(editor)
  }

  transformOperationRefs(editor, op)
  withInternalBatchReads(editor, () => {
    transformOperationTree(editor, op)
  })
  finalizeOperation(editor, op)
  stageLiveSplitBatchOperation(editor, op)

  return true
}

const tryStageLiveMoveOperation = (editor: Editor, op: Operation) => {
  if (op.type !== 'move_node' || isBatchingDirtyPaths(editor)) {
    return false
  }

  if (
    hasLiveInsertMoveBatch(editor) &&
    canExtendLiveInsertMoveBatch(editor, op)
  ) {
    transformOperationRefs(editor, op)
    transformOperationTree(editor, op)
    finalizeOperation(editor, op)
    stageLiveInsertMoveBatchOperations(editor, [op])
    return true
  }

  if (hasInsertNodeDraft(editor)) {
    const insertOps = getInsertNodeDraftOps(editor)

    promoteInsertNodeDraftToDraftChildren(editor)
    clearInsertNodeDraft(editor)

    if (isSameParentInsertMoveBatch([...insertOps, op])) {
      transformOperationRefs(editor, op)
      transformOperationTree(editor, op)
      finalizeOperation(editor, op)
      stageLiveInsertMoveBatchOperations(editor, [...insertOps, op])
      return true
    }
  }

  promoteDraftsBeforeLiveStructuralOp(editor)

  transformOperationRefs(editor, op)
  transformOperationTree(editor, op)
  finalizeOperation(editor, op)
  stageLiveMoveBatchOperation(editor, op)

  return true
}

export const applyOperationInBatch: WithEditorFirstArg<Editor['apply']> = (
  editor,
  op
) => {
  flushConflictingLiveBatches(editor, op)

  if (op.type !== 'merge_node' && hasMergeNodeDraft(editor)) {
    promoteMergeNodeDraftToDraftChildren(editor)
  }

  if (op.type !== 'split_node' && hasSplitNodeDraft(editor)) {
    promoteSplitNodeDraftToDraftChildren(editor)
  }

  if (tryStageTextBatchOperation(editor, op)) {
    return
  }

  if (tryStageExactSetNodeBatchOperation(editor, op)) {
    return
  }

  if (tryStageInsertBatchOperation(editor, op)) {
    return
  }

  if (tryStageLiveInsertMoveOperation(editor, op)) {
    return
  }

  if (tryStageLiveMergeOperation(editor, op)) {
    return
  }

  if (tryStageLiveSplitOperation(editor, op)) {
    return
  }

  if (tryStageLiveMoveOperation(editor, op)) {
    return
  }

  if (hasLiveInsertMoveBatch(editor)) {
    flushLiveInsertMoveBatch(editor)
  }

  if (hasLiveMergeBatch(editor)) {
    flushLiveMergeBatch(editor)
  }

  if (hasLiveSplitBatch(editor)) {
    flushLiveSplitBatch(editor)
  }

  promoteBufferedDraftsToDraftChildren(editor)
  runOperation(editor, op)
}

function applyWholeBatchFastPath(editor: Editor, ops: Operation[]) {
  if (isSameParentInsertBatch(ops)) {
    applyInsertBatchWithDirtyPathBatching(editor, ops)
    return true
  }

  if (isLiveSameParentMoveBatch(ops)) {
    applyDirtyPathBatchedOperations({
      editor,
      ops,
      newDirtyPaths: withInternalBatchReads(editor, () =>
        getSameParentMoveDirtyPaths(editor, ops)
      ),
      transformDirtyPath: withInternalBatchReads(editor, () =>
        createSameParentMoveDirtyPathTransform(editor, ops)
      ),
    })
    return true
  }

  return false
}

export const applyOperationBatch = (editor: Editor, ops: Operation[]) => {
  if (ops.length === 0) {
    return
  }

  if (applyWholeBatchFastPath(editor, ops)) {
    return
  }

  if (!batchNeedsSegmentPlanning(ops)) {
    Editor.withBatch(editor, () => {
      for (const op of ops) {
        editor.apply(op)
      }
    })
    return
  }

  const segments = segmentOperationBatch(ops)

  if (shouldPreferWholeBatchExecution(segments)) {
    Editor.withBatch(editor, () => {
      for (const op of ops) {
        editor.apply(op)
      }
    })
    return
  }

  Editor.withBatch(editor, () => {
    for (const segment of segments) {
      applyOperationBatchSegment(editor, segment)
    }
  })
}
