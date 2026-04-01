import { Path } from '../interfaces/path'
import {
  BaseInsertNodeOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseSplitNodeOperation,
  Operation,
} from '../interfaces/operation'

export type BatchSegmentKind =
  | 'generic'
  | 'same-parent-insert-move'
  | 'same-parent-insert'
  | 'same-parent-move'
  | 'move'
  | 'independent-split'
  | 'independent-merge'

export type BatchSegment = {
  kind: BatchSegmentKind
  ops: Operation[]
}

export const isSameParentInsertBatch = (
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

const isMoveNodeBatch = (ops: Operation[]) =>
  ops.length > 0 && ops.every(op => op.type === 'move_node')

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

export const isIndependentParentSplitBatch = (
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

export const isIndependentParentMergeBatch = (
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

export const planOperationBatchSegments = (
  ops: Operation[]
): BatchSegment[] => {
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
