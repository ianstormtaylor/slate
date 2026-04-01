import {
  BaseInsertNodeOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseSplitNodeOperation,
  Editor,
  Node,
  Operation,
  Path,
} from '../..'
import { updateDirtyPaths } from '../update-dirty-paths'
import {
  BATCH_LIVE_INSERT_MOVE_OPS,
  BATCH_LIVE_MERGE_OPS,
  BATCH_LIVE_MOVE_OPS,
  BATCH_LIVE_SPLIT_OPS,
  DIRTY_PATH_KEYS,
  DIRTY_PATHS,
} from '../../utils/weak-maps'

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

export const isMoveNodeBatch = (ops: Operation[]) =>
  ops.length > 0 && ops.every(op => op.type === 'move_node')

export const isSameParentMoveBatch = (
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

const getSingleSameParentMoveFinalPath = (op: BaseMoveNodeOperation) => {
  if (op.path.length === 0 || op.newPath.length === 0) {
    return null
  }

  const nextPath = Path.transform(op.path, op)

  if (!nextPath) {
    throw new Error(
      `Cannot apply a "move_node" operation at path [${op.path}] because the transformed destination is invalid.`
    )
  }

  return nextPath
}

const isSingleSameParentMoveBatch = (
  ops: BaseMoveNodeOperation[]
): ops is [BaseMoveNodeOperation] => ops.length === 1

const getSingleSameParentMoveDirtyPaths = (ops: [BaseMoveNodeOperation]) => {
  const [op] = ops
  const parentPath = Path.parent(op.path)
  const nextPath = getSingleSameParentMoveFinalPath(op)

  if (!nextPath) {
    throw new Error(
      `Cannot apply a "move_node" operation at path [${op.path}] because the transformed destination is invalid.`
    )
  }

  return [...Path.levels(parentPath), nextPath]
}

const createSingleSameParentMoveDirtyPathTransform = (
  ops: [BaseMoveNodeOperation]
) => {
  const [op] = ops
  const parentPath = Path.parent(op.path)
  const sourceIndex = op.path[parentPath.length]
  const targetPath = getSingleSameParentMoveFinalPath(op)

  if (!targetPath) {
    return (path: Path) => transformPathThroughOps(path, ops)
  }

  const targetIndex = targetPath[parentPath.length]

  return (path: Path) => {
    if (path.length <= parentPath.length) {
      return path
    }

    if (!Path.equals(path.slice(0, parentPath.length), parentPath)) {
      return transformPathThroughOps(path, ops)
    }

    const index = path[parentPath.length]
    let nextIndex = index

    if (index === sourceIndex) {
      nextIndex = targetIndex
    } else if (targetIndex < sourceIndex) {
      if (index >= targetIndex && index < sourceIndex) {
        nextIndex = index + 1
      }
    } else if (targetIndex > sourceIndex) {
      if (index > sourceIndex && index <= targetIndex) {
        nextIndex = index - 1
      }
    }

    return parentPath.concat(nextIndex, ...path.slice(parentPath.length + 1))
  }
}

export const getSameParentMoveDirtyPaths = (
  editor: Editor,
  ops: BaseMoveNodeOperation[]
) => {
  if (isSingleSameParentMoveBatch(ops)) {
    return getSingleSameParentMoveDirtyPaths(ops)
  }

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

    order.splice(truePath[truePath.length - 1], 0, movedIndex)
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

export const createSameParentMoveDirtyPathTransform = (
  editor: Editor,
  ops: BaseMoveNodeOperation[]
) => {
  if (isSingleSameParentMoveBatch(ops)) {
    return createSingleSameParentMoveDirtyPathTransform(ops)
  }

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

export const isSameParentInsertMoveOp = (
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

export const isSameParentInsertMoveBatch = (
  ops: Operation[]
): ops is (BaseInsertNodeOperation | BaseMoveNodeOperation)[] => {
  if (
    ops.length === 0 ||
    (ops[0].type !== 'insert_node' && ops[0].type !== 'move_node')
  ) {
    return false
  }

  const firstOp = ops[0]
  const parentPath =
    firstOp.type === 'insert_node'
      ? Path.parent(firstOp.path)
      : firstOp.path.length === 0 || firstOp.newPath.length === 0
      ? null
      : Path.parent(firstOp.path)

  if (
    !parentPath ||
    (firstOp.type === 'move_node' &&
      !Path.equals(Path.parent(firstOp.newPath), parentPath))
  ) {
    return false
  }

  let sawInsert = firstOp.type === 'insert_node'
  let sawMove = firstOp.type === 'move_node'

  for (const op of ops) {
    if (!isSameParentInsertMoveOp(op, parentPath)) {
      return false
    }

    sawInsert ||= op.type === 'insert_node'
    sawMove ||= op.type === 'move_node'
  }

  return sawInsert && sawMove
}

export const getSameParentInsertMoveDirtyPathState = (
  editor: Editor,
  ops: (BaseInsertNodeOperation | BaseMoveNodeOperation)[]
) => {
  if (!isSameParentInsertMoveBatch(ops)) {
    throw new Error(
      'Cannot batch insert_node and move_node operations unless every operation targets the same parent path.'
    )
  }

  const firstOp = ops[0]
  const parentPath = Path.parent(firstOp.path)
  const parent = parentPath.length === 0 ? editor : Node.get(editor, parentPath)

  if (!Node.isEditor(parent) && !Node.isElement(parent)) {
    throw new Error(
      `Cannot batch insert_node and move_node operations beneath non-container node at path [${parentPath}].`
    )
  }

  const order: (number | string)[] = Array.from(
    { length: parent.children.length },
    (_, index) => index
  )
  const insertedNodes = new Map<string, Node>()
  const movedOriginalIndexes = new Set<number>()
  let insertedTokenIndex = 0

  for (const op of ops) {
    if (op.type === 'insert_node') {
      const targetIndex = op.path[op.path.length - 1]

      if (targetIndex > order.length) {
        throw new Error(
          `Cannot apply an "insert_node" operation at path [${op.path}] because the destination is past the end of the node.`
        )
      }

      const token = `inserted:${insertedTokenIndex++}`
      insertedNodes.set(token, op.node)
      order.splice(targetIndex, 0, token)
      continue
    }

    const sourceIndex = op.path[op.path.length - 1]
    const [token] = order.splice(sourceIndex, 1)

    if (token == null) {
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
    order.splice(targetIndex, 0, token)

    if (typeof token === 'number') {
      movedOriginalIndexes.add(token)
    }
  }

  const finalOriginalPositions = new Map<number, number>()
  const newDirtyPaths: Path[] = Path.levels(parentPath)

  order.forEach((token, position) => {
    const finalPath = parentPath.concat(position)

    if (typeof token === 'number') {
      finalOriginalPositions.set(token, position)

      if (movedOriginalIndexes.has(token)) {
        newDirtyPaths.push(finalPath)
      }

      return
    }

    const node = insertedNodes.get(token)

    if (!node) {
      return
    }

    newDirtyPaths.push(finalPath)

    if (!Node.isText(node)) {
      newDirtyPaths.push(
        ...Array.from(Node.nodes(node), ([, path]) => finalPath.concat(path))
      )
    }
  })

  const transformDirtyPath = (path: Path) => {
    if (path.length <= parentPath.length) {
      return path
    }

    if (!Path.equals(path.slice(0, parentPath.length), parentPath)) {
      return transformPathThroughOps(path, ops)
    }

    const originalIndex = path[parentPath.length]
    const nextIndex = finalOriginalPositions.get(originalIndex)

    if (nextIndex == null) {
      return transformPathThroughOps(path, ops)
    }

    return parentPath.concat(nextIndex, ...path.slice(parentPath.length + 1))
  }

  return { newDirtyPaths, transformDirtyPath }
}

export const createIndependentParentStructuralDirtyPathTransform = (
  ops: (BaseMergeNodeOperation | BaseSplitNodeOperation)[]
) => {
  const opsByParentPathKey = new Map(
    ops.map(op => [Path.parent(op.path).join(','), op] as const)
  )

  return (path: Path) => {
    for (let length = path.length; length >= 0; length--) {
      const parentOp = opsByParentPathKey.get(path.slice(0, length).join(','))

      if (!parentOp) {
        continue
      }

      if (length === path.length) {
        return path
      }

      return Path.transform(path, parentOp)
    }

    return path
  }
}

const isIndependentParentStructuralBatch = (
  ops: (BaseMergeNodeOperation | BaseSplitNodeOperation)[]
) => {
  const parentPathKeys = new Set<string>()

  for (const op of ops) {
    const key = Path.parent(op.path).join(',')

    if (parentPathKeys.has(key)) {
      return false
    }

    parentPathKeys.add(key)
  }

  return true
}

export const isIndependentParentSplitBatch = (
  ops: Operation[]
): ops is BaseSplitNodeOperation[] =>
  ops.length > 0 &&
  ops.every(op => op.type === 'split_node') &&
  isIndependentParentStructuralBatch(ops as BaseSplitNodeOperation[])

export const isIndependentParentMergeBatch = (
  ops: Operation[]
): ops is BaseMergeNodeOperation[] =>
  ops.length > 0 &&
  ops.every(op => op.type === 'merge_node') &&
  isIndependentParentStructuralBatch(ops as BaseMergeNodeOperation[])

export const getIndependentParentMergeDirtyPathState = (
  ops: BaseMergeNodeOperation[]
) => {
  const newDirtyPaths: Path[] = []
  const newDirtyPathKeys = new Set<string>()

  const add = (path: Path) => {
    const key = path.join(',')

    if (!newDirtyPathKeys.has(key)) {
      newDirtyPathKeys.add(key)
      newDirtyPaths.push(path)
    }
  }

  for (const op of ops) {
    for (const path of Path.ancestors(op.path)) {
      add(path)
    }

    add(Path.previous(op.path))
  }

  return {
    newDirtyPaths,
    transformDirtyPath:
      createIndependentParentStructuralDirtyPathTransform(ops),
  }
}

export const getIndependentParentSplitDirtyPathState = (
  editor: Editor,
  ops: BaseSplitNodeOperation[]
) => {
  const newDirtyPaths: Path[] = []
  const newDirtyPathKeys = new Set<string>()

  const add = (path: Path) => {
    const key = path.join(',')

    if (!newDirtyPathKeys.has(key)) {
      newDirtyPathKeys.add(key)
      newDirtyPaths.push(path)
    }
  }

  for (const op of ops) {
    for (const path of editor.getDirtyPaths(op)) {
      add(path)
    }
  }

  return {
    newDirtyPaths,
    transformDirtyPath:
      createIndependentParentStructuralDirtyPathTransform(ops),
  }
}

const calculateDirtyPathsAfterBatch = (editor: Editor, ops: Operation[]) => {
  let dirtyPaths = [...(DIRTY_PATHS.get(editor) ?? [])]
  let dirtyPathKeys = new Set(DIRTY_PATH_KEYS.get(editor) ?? [])

  const add = (path: Path | null) => {
    if (!path) return

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

export const hasLiveMoveBatch = (editor: Editor) =>
  (BATCH_LIVE_MOVE_OPS.get(editor)?.length ?? 0) > 0

export const hasLiveInsertMoveBatch = (editor: Editor) =>
  (BATCH_LIVE_INSERT_MOVE_OPS.get(editor)?.length ?? 0) > 0

export const stageLiveMoveBatchOperation = (
  editor: Editor,
  op: BaseMoveNodeOperation
) => {
  const ops = BATCH_LIVE_MOVE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_LIVE_MOVE_OPS.set(editor, [op])
}

export const canExtendLiveInsertMoveBatch = (editor: Editor, op: Operation) => {
  const ops = BATCH_LIVE_INSERT_MOVE_OPS.get(editor)

  if (!ops || ops.length === 0) {
    return false
  }

  const firstOp = ops[0]
  const parentPath =
    firstOp.type === 'insert_node'
      ? Path.parent(firstOp.path)
      : Path.parent(firstOp.path)

  return isSameParentInsertMoveOp(op, parentPath)
}

export const stageLiveInsertMoveBatchOperations = (
  editor: Editor,
  ops: (BaseInsertNodeOperation | BaseMoveNodeOperation)[]
) => {
  const current = BATCH_LIVE_INSERT_MOVE_OPS.get(editor)

  if (current) {
    current.push(...ops)
    return
  }

  BATCH_LIVE_INSERT_MOVE_OPS.set(editor, [...ops])
}

export const clearLiveInsertMoveBatch = (editor: Editor) => {
  BATCH_LIVE_INSERT_MOVE_OPS.delete(editor)
}

export const flushLiveInsertMoveBatch = (editor: Editor) => {
  const ops = BATCH_LIVE_INSERT_MOVE_OPS.get(editor)

  if (!ops || ops.length === 0) {
    return
  }

  BATCH_LIVE_INSERT_MOVE_OPS.delete(editor)

  if (isSameParentInsertMoveBatch(ops)) {
    const { newDirtyPaths, transformDirtyPath } =
      getSameParentInsertMoveDirtyPathState(editor, ops)

    updateDirtyPaths(editor, newDirtyPaths, transformDirtyPath)
    return
  }

  const { dirtyPathKeys, dirtyPaths } = calculateDirtyPathsAfterBatch(
    editor,
    ops
  )
  DIRTY_PATHS.set(editor, dirtyPaths)
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
}

export const clearLiveMoveBatch = (editor: Editor) => {
  BATCH_LIVE_MOVE_OPS.delete(editor)
}

export const hasLiveMergeBatch = (editor: Editor) =>
  (BATCH_LIVE_MERGE_OPS.get(editor)?.length ?? 0) > 0

export const hasLiveSplitBatch = (editor: Editor) =>
  (BATCH_LIVE_SPLIT_OPS.get(editor)?.length ?? 0) > 0

export const stageLiveMergeBatchOperation = (
  editor: Editor,
  op: BaseMergeNodeOperation
) => {
  const ops = BATCH_LIVE_MERGE_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_LIVE_MERGE_OPS.set(editor, [op])
}

export const flushLiveMergeBatch = (editor: Editor) => {
  const ops = BATCH_LIVE_MERGE_OPS.get(editor)

  if (!ops || ops.length === 0) {
    return
  }

  BATCH_LIVE_MERGE_OPS.delete(editor)

  if (isIndependentParentMergeBatch(ops)) {
    const { newDirtyPaths, transformDirtyPath } =
      getIndependentParentMergeDirtyPathState(ops)

    updateDirtyPaths(editor, newDirtyPaths, transformDirtyPath)
    return
  }

  const mergeOps = ops as BaseMergeNodeOperation[]

  updateDirtyPaths(
    editor,
    mergeOps.flatMap(op => editor.getDirtyPaths(op)),
    createIndependentParentStructuralDirtyPathTransform(mergeOps)
  )
}

export const clearLiveMergeBatch = (editor: Editor) => {
  BATCH_LIVE_MERGE_OPS.delete(editor)
}

export const stageLiveSplitBatchOperation = (
  editor: Editor,
  op: BaseSplitNodeOperation
) => {
  const ops = BATCH_LIVE_SPLIT_OPS.get(editor)

  if (ops) {
    ops.push(op)
    return
  }

  BATCH_LIVE_SPLIT_OPS.set(editor, [op])
}

export const flushLiveSplitBatch = (editor: Editor) => {
  const ops = BATCH_LIVE_SPLIT_OPS.get(editor)

  if (!ops || ops.length === 0) {
    return
  }

  BATCH_LIVE_SPLIT_OPS.delete(editor)

  if (isIndependentParentStructuralBatch(ops)) {
    const { newDirtyPaths, transformDirtyPath } =
      getIndependentParentSplitDirtyPathState(editor, ops)

    updateDirtyPaths(editor, newDirtyPaths, transformDirtyPath)
    return
  }

  const { dirtyPathKeys, dirtyPaths } = calculateDirtyPathsAfterBatch(
    editor,
    ops
  )

  DIRTY_PATHS.set(editor, dirtyPaths)
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
}

export const clearLiveSplitBatch = (editor: Editor) => {
  BATCH_LIVE_SPLIT_OPS.delete(editor)
}

export const flushLiveMoveBatch = (editor: Editor) => {
  const ops = BATCH_LIVE_MOVE_OPS.get(editor)

  if (!ops || ops.length === 0) {
    return
  }

  BATCH_LIVE_MOVE_OPS.delete(editor)

  if (isSameParentMoveBatch(ops)) {
    updateDirtyPaths(
      editor,
      getSameParentMoveDirtyPaths(editor, ops),
      createSameParentMoveDirtyPathTransform(editor, ops)
    )
    return
  }

  const { dirtyPathKeys, dirtyPaths } = calculateDirtyPathsAfterBatch(
    editor,
    ops
  )
  DIRTY_PATHS.set(editor, dirtyPaths)
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
}
