import { Path } from '../interfaces/path'
import { WithEditorFirstArg } from '../utils/types'
import {
  BaseInsertNodeOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseSplitNodeOperation,
  Operation,
} from '../interfaces/operation'
import { Editor } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { isBatchingDirtyPaths } from './batch-dirty-paths'
import {
  batchOperationDirtyPaths,
  finalizeOperation,
  runOperation,
  transformOperationRefs,
  transformOperationSelection,
  transformOperationTree,
  updateOperationDirtyPaths,
} from './apply-operation'
import { isBatching, scheduleOnChange, withInternalBatchReads } from './batch'
import {
  canStageInsertNodeOperation,
  hasTextDraft,
  getInsertNodeDraftOps,
  hasDraftChildren,
  hasInsertNodeDraft,
  hasExactSetNodeDraft,
  promoteInsertNodeDraftToDraftChildren,
  promoteExactSetNodeDraftToDraftChildren,
  promoteTextDraftToDraftChildren,
  stageInsertNodeOperation,
  stageExactSetNodeOperation,
  stageTextOperation,
  clearInsertNodeDraft,
} from './children'
import {
  canExtendLiveInsertMoveBatch,
  createSameParentMoveDirtyPathTransform as createLiveSameParentMoveDirtyPathTransform,
  flushLiveInsertMoveBatch,
  flushLiveMergeBatch,
  flushLiveMoveBatch,
  getSameParentInsertMoveDirtyPathState,
  getSameParentMoveDirtyPaths as getLiveSameParentMoveDirtyPaths,
  hasLiveInsertMoveBatch,
  hasLiveMergeBatch,
  hasLiveMoveBatch,
  isSameParentInsertMoveBatch,
  isMoveNodeBatch as isLiveMoveNodeBatch,
  isSameParentMoveBatch as isLiveSameParentMoveBatch,
  stageLiveInsertMoveBatchOperations,
  stageLiveMergeBatchOperation,
  stageLiveMoveBatchOperation,
} from './live-move-dirty-paths'
import { updateDirtyPaths } from './update-dirty-paths'
import { DIRTY_PATH_KEYS, DIRTY_PATHS } from '../utils/weak-maps'

type BatchSegmentKind =
  | 'generic'
  | 'same-parent-insert-move'
  | 'same-parent-insert'
  | 'same-parent-move'
  | 'move'
  | 'independent-split'
  | 'independent-merge'

type BatchSegment = {
  kind: BatchSegmentKind
  ops: Operation[]
}

const isSameParentInsertBatch = (
  ops: Operation[]
): ops is BaseInsertNodeOperation[] => {
  if (ops.length === 0 || ops.some(op => op.type !== 'insert_node')) {
    return false
  }

  const insertOps = ops as BaseInsertNodeOperation[]
  const parentPath = Path.parent(insertOps[0].path)

  return insertOps.every(op => Path.equals(Path.parent(op.path), parentPath))
}

const getSameParentInsertSegmentEnd = (
  ops: Operation[],
  startIndex: number
) => {
  const op = ops[startIndex]

  if (!op || op.type !== 'insert_node') {
    return startIndex
  }

  const parentPath = Path.parent(op.path)
  let endIndex = startIndex + 1

  while (endIndex < ops.length) {
    const nextOp = ops[endIndex]

    if (
      nextOp.type !== 'insert_node' ||
      !Path.equals(Path.parent(nextOp.path), parentPath)
    ) {
      break
    }

    endIndex++
  }

  return endIndex
}

const isSameParentInsertMoveOp = (
  op: Operation,
  parentPath: Path
): op is BaseInsertNodeOperation | BaseMoveNodeOperation => {
  if (op.type === 'insert_node') {
    return Path.equals(Path.parent(op.path), parentPath)
  }

  if (op.type === 'move_node') {
    if (op.path.length === 0 || op.newPath.length === 0) {
      return false
    }

    return (
      Path.equals(Path.parent(op.path), parentPath) &&
      Path.equals(Path.parent(op.newPath), parentPath)
    )
  }

  return false
}

const getSameParentInsertMoveSegmentEnd = (
  ops: Operation[],
  startIndex: number
) => {
  const firstOp = ops[startIndex]

  if (
    !firstOp ||
    (firstOp.type !== 'insert_node' && firstOp.type !== 'move_node')
  ) {
    return startIndex
  }

  const parentPath =
    firstOp.type === 'insert_node'
      ? Path.parent(firstOp.path)
      : firstOp.path.length === 0 || firstOp.newPath.length === 0
      ? null
      : Path.parent(firstOp.path)

  if (!parentPath) {
    return startIndex
  }

  let sawInsert = firstOp.type === 'insert_node'
  let sawMove = firstOp.type === 'move_node'
  let endIndex = startIndex + 1

  while (endIndex < ops.length) {
    const nextOp = ops[endIndex]

    if (!isSameParentInsertMoveOp(nextOp, parentPath)) {
      break
    }

    sawInsert ||= nextOp.type === 'insert_node'
    sawMove ||= nextOp.type === 'move_node'
    endIndex++
  }

  return sawInsert && sawMove ? endIndex : startIndex
}

const hasOverlappingPaths = (paths: Path[]) => {
  for (let index = 0; index < paths.length; index++) {
    for (let nextIndex = index + 1; nextIndex < paths.length; nextIndex++) {
      const path = paths[index]
      const nextPath = paths[nextIndex]

      if (
        Path.equals(path, nextPath) ||
        Path.isAncestor(path, nextPath) ||
        Path.isAncestor(nextPath, path)
      ) {
        return true
      }
    }
  }

  return false
}

const isIndependentParentSplitBatch = (
  ops: Operation[]
): ops is BaseSplitNodeOperation[] => {
  if (ops.length === 0 || ops.some(op => op.type !== 'split_node')) {
    return false
  }

  const splitOps = ops as BaseSplitNodeOperation[]

  if (splitOps.some(op => op.path.length <= 1)) {
    return false
  }

  return !hasOverlappingPaths(splitOps.map(op => Path.parent(op.path)))
}

const isIndependentParentMergeBatch = (
  ops: Operation[]
): ops is BaseMergeNodeOperation[] => {
  if (ops.length === 0 || ops.some(op => op.type !== 'merge_node')) {
    return false
  }

  const mergeOps = ops as BaseMergeNodeOperation[]

  if (mergeOps.some(op => op.path.length <= 1)) {
    return false
  }

  return !hasOverlappingPaths(mergeOps.map(op => Path.parent(op.path)))
}

const getIndependentParentSegmentEnd = (
  ops: Operation[],
  startIndex: number,
  type: 'split_node' | 'merge_node'
) => {
  const firstOp = ops[startIndex]

  if (!firstOp || firstOp.type !== type || firstOp.path.length <= 1) {
    return startIndex
  }

  const parentPaths: Path[] = []
  let endIndex = startIndex

  while (endIndex < ops.length) {
    const op = ops[endIndex]

    if (op.type !== type || op.path.length <= 1) {
      break
    }

    const parentPath = Path.parent(op.path)

    if (
      parentPaths.some(
        path =>
          Path.equals(path, parentPath) ||
          Path.isAncestor(path, parentPath) ||
          Path.isAncestor(parentPath, path)
      )
    ) {
      break
    }

    parentPaths.push(parentPath)
    endIndex++
  }

  return endIndex
}

const isMoveNodeBatch = (ops: Operation[]) =>
  ops.length > 0 && ops.every(op => op.type === 'move_node')

const isSameParentMoveBatch = (
  ops: Operation[]
): ops is BaseMoveNodeOperation[] => {
  if (!isMoveNodeBatch(ops)) {
    return false
  }

  const moveOps = ops as BaseMoveNodeOperation[]

  if (moveOps.some(op => op.path.length === 0 || op.newPath.length === 0)) {
    return false
  }

  const parentPath = Path.parent(moveOps[0].path)

  return moveOps.every(
    op =>
      Path.equals(Path.parent(op.path), parentPath) &&
      Path.equals(Path.parent(op.newPath), parentPath)
  )
}

const getSameParentMoveSegmentEnd = (ops: Operation[], startIndex: number) => {
  const op = ops[startIndex]

  if (
    !op ||
    op.type !== 'move_node' ||
    op.path.length === 0 ||
    op.newPath.length === 0
  ) {
    return startIndex
  }

  const pathParent = Path.parent(op.path)
  const newPathParent = Path.parent(op.newPath)
  let endIndex = startIndex + 1

  while (endIndex < ops.length) {
    const nextOp = ops[endIndex]

    if (
      nextOp.type !== 'move_node' ||
      nextOp.path.length === 0 ||
      nextOp.newPath.length === 0 ||
      !Path.equals(Path.parent(nextOp.path), pathParent) ||
      !Path.equals(Path.parent(nextOp.newPath), newPathParent)
    ) {
      break
    }

    endIndex++
  }

  return endIndex
}

const getMoveSegmentEnd = (ops: Operation[], startIndex: number) => {
  if (!ops[startIndex] || ops[startIndex].type !== 'move_node') {
    return startIndex
  }

  let endIndex = startIndex + 1

  while (endIndex < ops.length && ops[endIndex].type === 'move_node') {
    endIndex++
  }

  return endIndex
}

const transformPathThroughOps = (path: Path, ops: Operation[]) => {
  let nextPath: Path | null = path

  for (const op of ops) {
    if (Path.operationCanTransformPath(op)) {
      nextPath = Path.transform(nextPath, op)

      if (!nextPath) {
        return null
      }
    }
  }

  return nextPath
}

const applyOperationBatchWithDirtyPathBatching = (
  editor: Editor,
  ops: Operation[],
  newDirtyPaths: Path[],
  transformDirtyPath: (path: Path) => Path | null = path =>
    transformPathThroughOps(path, ops)
) => {
  batchOperationDirtyPaths(
    editor,
    () => {
      Editor.withBatch(editor, () => {
        for (const op of ops) {
          editor.apply(op)
        }

        updateDirtyPaths(editor, newDirtyPaths, transformDirtyPath)
      })
    },
    () => {}
  )
}

const applyOperationBatchWithInsertDirtyPathBatching = (
  editor: Editor,
  ops: BaseInsertNodeOperation[]
) => {
  const parentPath = Path.parent(ops[0].path)
  const newDirtyPaths: Path[] = Path.levels(parentPath)

  for (const op of ops) {
    newDirtyPaths.push(op.path)

    if (!Node.isText(op.node)) {
      newDirtyPaths.push(
        ...Array.from(Node.nodes(op.node), ([, path]) => op.path.concat(path))
      )
    }
  }

  batchOperationDirtyPaths(
    editor,
    () => {
      Editor.withBatch(editor, () => {
        for (const op of ops) {
          editor.apply(op)
        }

        updateDirtyPaths(editor, newDirtyPaths, path => {
          let nextPath: Path | null = path

          for (const op of ops) {
            if (Path.operationCanTransformPath(op)) {
              nextPath = Path.transform(nextPath, op)

              if (!nextPath) {
                return null
              }
            }
          }

          return nextPath
        })
      })
    },
    () => {}
  )
}

const getSameParentMoveDirtyPaths = (
  editor: Editor,
  ops: BaseMoveNodeOperation[]
) => {
  const parentPath = Path.parent(ops[0].path)
  const parent = parentPath.length === 0 ? editor : Node.get(editor, parentPath)

  if (!Node.isEditor(parent) && !Node.isElement(parent)) {
    throw new Error(
      `Cannot batch move_node operations beneath non-container node at path [${parentPath}].`
    )
  }

  const order = Array.from(
    { length: parent.children.length },
    (_, index) => index
  )
  const movedIndexes = new Set<number>()

  for (const op of ops) {
    const sourceIndex = op.path[op.path.length - 1]
    const [movedIndex] = order.splice(sourceIndex, 1)

    if (movedIndex == null) {
      throw new Error(
        `Cannot apply a "move_node" operation at path [${op.path}] because the source does not exist.`
      )
    }

    const truePath = Path.transform(op.path, op)

    if (!truePath) {
      throw new Error(
        `Cannot apply a "move_node" operation at path [${op.path}] because the transformed destination is invalid.`
      )
    }

    const targetIndex = truePath[truePath.length - 1]
    order.splice(targetIndex, 0, movedIndex)
    movedIndexes.add(movedIndex)
  }

  const newDirtyPaths = Path.levels(parentPath)

  order.forEach((index, position) => {
    if (movedIndexes.has(index)) {
      newDirtyPaths.push(parentPath.concat(position))
    }
  })

  return newDirtyPaths
}

const createSameParentMoveDirtyPathTransform = (
  editor: Editor,
  ops: BaseMoveNodeOperation[]
) => {
  const parentPath = Path.parent(ops[0].path)
  const parent = parentPath.length === 0 ? editor : Node.get(editor, parentPath)

  if (!Node.isEditor(parent) && !Node.isElement(parent)) {
    return (path: Path) => transformPathThroughOps(path, ops)
  }

  const order = Array.from(
    { length: parent.children.length },
    (_, index) => index
  )

  for (const op of ops) {
    const sourceIndex = op.path[op.path.length - 1]
    const [movedIndex] = order.splice(sourceIndex, 1)

    if (movedIndex == null) {
      return (path: Path) => transformPathThroughOps(path, ops)
    }

    const truePath = Path.transform(op.path, op)

    if (!truePath) {
      return (path: Path) => transformPathThroughOps(path, ops)
    }

    order.splice(truePath[truePath.length - 1], 0, movedIndex)
  }

  const finalPositions = new Map<number, number>()
  order.forEach((originalIndex, position) => {
    finalPositions.set(originalIndex, position)
  })

  return (path: Path) => {
    if (path.length <= parentPath.length) {
      return path
    }

    if (!Path.equals(path.slice(0, parentPath.length), parentPath)) {
      return transformPathThroughOps(path, ops)
    }

    const originalIndex = path[parentPath.length]
    const nextIndex = finalPositions.get(originalIndex)

    if (nextIndex == null) {
      return transformPathThroughOps(path, ops)
    }

    return parentPath.concat(nextIndex, ...path.slice(parentPath.length + 1))
  }
}

const calculateDirtyPathsAfterBatch = (editor: Editor, ops: Operation[]) => {
  let dirtyPaths = [...(DIRTY_PATHS.get(editor) ?? [])]
  let dirtyPathKeys = new Set(DIRTY_PATH_KEYS.get(editor) ?? [])

  const add = (path: Path | null) => {
    if (!path) {
      return
    }

    const key = path.join(',')

    if (!dirtyPathKeys.has(key)) {
      dirtyPathKeys.add(key)
      dirtyPaths.push(path)
    }
  }

  for (const op of ops) {
    if (Path.operationCanTransformPath(op)) {
      const nextDirtyPaths: Path[] = []
      const nextDirtyPathKeys = new Set<string>()

      for (const path of dirtyPaths) {
        const nextPath = Path.transform(path, op)

        if (!nextPath) {
          continue
        }

        const key = nextPath.join(',')

        if (!nextDirtyPathKeys.has(key)) {
          nextDirtyPathKeys.add(key)
          nextDirtyPaths.push(nextPath)
        }
      }

      dirtyPaths = nextDirtyPaths
      dirtyPathKeys = nextDirtyPathKeys
    }

    for (const path of editor.getDirtyPaths(op)) {
      add(path)
    }
  }

  return { dirtyPathKeys, dirtyPaths }
}

const getSpecializedBatchSegment = (
  ops: Operation[],
  startIndex: number
): { endIndex: number; kind: Exclude<BatchSegmentKind, 'generic'> } | null => {
  const sameParentInsertMoveEnd = getSameParentInsertMoveSegmentEnd(
    ops,
    startIndex
  )

  if (sameParentInsertMoveEnd - startIndex > 1) {
    return {
      endIndex: sameParentInsertMoveEnd,
      kind: 'same-parent-insert-move',
    }
  }

  const sameParentInsertEnd = getSameParentInsertSegmentEnd(ops, startIndex)

  if (sameParentInsertEnd - startIndex > 1) {
    return { endIndex: sameParentInsertEnd, kind: 'same-parent-insert' }
  }

  const sameParentMoveEnd = getSameParentMoveSegmentEnd(ops, startIndex)

  if (sameParentMoveEnd - startIndex > 1) {
    return { endIndex: sameParentMoveEnd, kind: 'same-parent-move' }
  }

  const moveEnd = getMoveSegmentEnd(ops, startIndex)

  if (moveEnd - startIndex > 1) {
    return { endIndex: moveEnd, kind: 'move' }
  }

  const independentSplitEnd = getIndependentParentSegmentEnd(
    ops,
    startIndex,
    'split_node'
  )

  if (independentSplitEnd - startIndex > 1) {
    return { endIndex: independentSplitEnd, kind: 'independent-split' }
  }

  const independentMergeEnd = getIndependentParentSegmentEnd(
    ops,
    startIndex,
    'merge_node'
  )

  if (independentMergeEnd - startIndex > 1) {
    return { endIndex: independentMergeEnd, kind: 'independent-merge' }
  }

  return null
}

const planOperationBatchSegments = (ops: Operation[]): BatchSegment[] => {
  const segments: BatchSegment[] = []
  let startIndex = 0

  while (startIndex < ops.length) {
    const specializedSegment = getSpecializedBatchSegment(ops, startIndex)

    if (specializedSegment) {
      segments.push({
        kind: specializedSegment.kind,
        ops: ops.slice(startIndex, specializedSegment.endIndex),
      })
      startIndex = specializedSegment.endIndex
      continue
    }

    let endIndex = startIndex + 1

    while (
      endIndex < ops.length &&
      !getSpecializedBatchSegment(ops, endIndex)
    ) {
      endIndex++
    }

    segments.push({ kind: 'generic', ops: ops.slice(startIndex, endIndex) })
    startIndex = endIndex
  }

  return segments
}

const applyOperationBatchWithSimulatedDirtyPaths = (
  editor: Editor,
  ops: Operation[]
) => {
  const { dirtyPathKeys, dirtyPaths } = calculateDirtyPathsAfterBatch(
    editor,
    ops
  )

  batchOperationDirtyPaths(
    editor,
    () => {
      Editor.withBatch(editor, () => {
        for (const op of ops) {
          editor.apply(op)
        }

        DIRTY_PATHS.set(editor, dirtyPaths)
        DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
      })
    },
    () => {}
  )
}

const applyOperationBatchSegment = (editor: Editor, segment: BatchSegment) => {
  switch (segment.kind) {
    case 'same-parent-insert-move':
      {
        const { newDirtyPaths, transformDirtyPath } = withInternalBatchReads(
          editor,
          () =>
            getSameParentInsertMoveDirtyPathState(
              editor,
              segment.ops as (BaseInsertNodeOperation | BaseMoveNodeOperation)[]
            )
        )

        applyOperationBatchWithDirtyPathBatching(
          editor,
          segment.ops,
          newDirtyPaths,
          transformDirtyPath
        )
      }
      return
    case 'same-parent-insert':
      applyOperationBatchWithInsertDirtyPathBatching(
        editor,
        segment.ops as BaseInsertNodeOperation[]
      )
      return
    case 'same-parent-move':
      applyOperationBatchWithDirtyPathBatching(
        editor,
        segment.ops,
        withInternalBatchReads(editor, () =>
          getSameParentMoveDirtyPaths(
            editor,
            segment.ops as BaseMoveNodeOperation[]
          )
        ),
        withInternalBatchReads(editor, () =>
          createSameParentMoveDirtyPathTransform(
            editor,
            segment.ops as BaseMoveNodeOperation[]
          )
        )
      )
      return
    case 'move':
      withInternalBatchReads(editor, () =>
        applyOperationBatchWithSimulatedDirtyPaths(editor, segment.ops)
      )
      return
    case 'independent-split':
    case 'independent-merge':
      applyOperationBatchWithDirtyPathBatching(
        editor,
        segment.ops,
        withInternalBatchReads(editor, () =>
          segment.ops.flatMap(op => editor.getDirtyPaths(op))
        )
      )
      return
    case 'generic':
      for (const op of segment.ops) {
        editor.apply(op)
      }
      return
  }
}

const applyOperationInBatch: WithEditorFirstArg<Editor['apply']> = (
  editor,
  op
) =>
  withInternalBatchReads(editor, () => {
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

    if (
      (op.type === 'insert_text' || op.type === 'remove_text') &&
      !hasDraftChildren(editor) &&
      !hasExactSetNodeDraft(editor) &&
      !hasInsertNodeDraft(editor)
    ) {
      transformOperationRefs(editor, op)
      transformOperationSelection(editor, op)
      updateOperationDirtyPaths(editor, op)
      stageTextOperation(editor, op)
      finalizeOperation(editor, op)
      return
    }

    if (
      op.type === 'set_node' &&
      !hasDraftChildren(editor) &&
      !hasInsertNodeDraft(editor) &&
      !hasTextDraft(editor)
    ) {
      transformOperationRefs(editor, op)
      updateOperationDirtyPaths(editor, op)
      stageExactSetNodeOperation(editor, op)
      finalizeOperation(editor, op)
      return
    }

    if (
      op.type === 'insert_node' &&
      !hasLiveInsertMoveBatch(editor) &&
      !hasDraftChildren(editor) &&
      !hasExactSetNodeDraft(editor) &&
      !hasTextDraft(editor) &&
      canStageInsertNodeOperation(editor, op)
    ) {
      transformOperationRefs(editor, op)
      updateOperationDirtyPaths(editor, op)
      stageInsertNodeOperation(editor, op)
      finalizeOperation(editor, op)
      return
    }

    if (
      op.type === 'insert_node' &&
      hasLiveInsertMoveBatch(editor) &&
      canExtendLiveInsertMoveBatch(editor, op) &&
      !isBatchingDirtyPaths(editor)
    ) {
      transformOperationRefs(editor, op)
      transformOperationTree(editor, op)
      finalizeOperation(editor, op)
      stageLiveInsertMoveBatchOperations(editor, [op])
      return
    }

    if (op.type === 'merge_node' && !isBatchingDirtyPaths(editor)) {
      transformOperationRefs(editor, op)
      transformOperationTree(editor, op)
      finalizeOperation(editor, op)
      stageLiveMergeBatchOperation(editor, op)
      return
    }

    if (op.type === 'move_node' && !isBatchingDirtyPaths(editor)) {
      if (
        hasLiveInsertMoveBatch(editor) &&
        canExtendLiveInsertMoveBatch(editor, op)
      ) {
        transformOperationRefs(editor, op)
        transformOperationTree(editor, op)
        finalizeOperation(editor, op)
        stageLiveInsertMoveBatchOperations(editor, [op])
        return
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
          return
        }
      }

      if (hasExactSetNodeDraft(editor)) {
        promoteExactSetNodeDraftToDraftChildren(editor)
      }

      if (hasInsertNodeDraft(editor)) {
        promoteInsertNodeDraftToDraftChildren(editor)
      }

      transformOperationRefs(editor, op)
      transformOperationTree(editor, op)
      finalizeOperation(editor, op)
      stageLiveMoveBatchOperation(editor, op)
      return
    }

    if (hasLiveInsertMoveBatch(editor)) {
      flushLiveInsertMoveBatch(editor)
    }

    if (hasLiveMergeBatch(editor)) {
      flushLiveMergeBatch(editor)
    }

    if (hasExactSetNodeDraft(editor)) {
      promoteExactSetNodeDraftToDraftChildren(editor)
    }

    if (hasTextDraft(editor)) {
      promoteTextDraftToDraftChildren(editor)
    }

    if (hasInsertNodeDraft(editor)) {
      promoteInsertNodeDraftToDraftChildren(editor)
    }

    runOperation(editor, op)
  })

export const applyOperationBatch = (editor: Editor, ops: Operation[]) => {
  if (ops.length === 0) {
    return
  }

  if (isSameParentInsertBatch(ops)) {
    applyOperationBatchWithInsertDirtyPathBatching(editor, ops)
    return
  }

  if (isLiveSameParentMoveBatch(ops)) {
    applyOperationBatchWithDirtyPathBatching(
      editor,
      ops,
      withInternalBatchReads(editor, () =>
        getLiveSameParentMoveDirtyPaths(editor, ops)
      ),
      withInternalBatchReads(editor, () =>
        createLiveSameParentMoveDirtyPathTransform(editor, ops)
      )
    )
    return
  }

  if (isLiveMoveNodeBatch(ops)) {
    withInternalBatchReads(editor, () =>
      applyOperationBatchWithSimulatedDirtyPaths(editor, ops)
    )
    return
  }

  if (
    isIndependentParentSplitBatch(ops) ||
    isIndependentParentMergeBatch(ops)
  ) {
    applyOperationBatchWithDirtyPathBatching(
      editor,
      ops,
      withInternalBatchReads(editor, () =>
        ops.flatMap(op => editor.getDirtyPaths(op))
      )
    )
    return
  }

  const segments = planOperationBatchSegments(ops)

  Editor.withBatch(editor, () => {
    for (const segment of segments) {
      applyOperationBatchSegment(editor, segment)
    }
  })
}

const applyOperationNormally: WithEditorFirstArg<Editor['apply']> = (
  editor,
  op
) => {
  runOperation(editor, op)
  scheduleOnChange(editor)
}

export const apply: WithEditorFirstArg<Editor['apply']> = (editor, op) => {
  if (isBatching(editor)) {
    applyOperationInBatch(editor, op)
    return
  }

  applyOperationNormally(editor, op)
}
