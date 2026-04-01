import {
  BaseInsertNodeOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  Editor,
  Node,
  Operation,
  Path,
} from '..'
import { updateDirtyPaths } from './update-dirty-paths'
import {
  BATCH_LIVE_INSERT_MOVE_OPS,
  BATCH_LIVE_MERGE_OPS,
  BATCH_LIVE_MOVE_OPS,
  DIRTY_PATH_KEYS,
  DIRTY_PATHS,
} from '../utils/weak-maps'

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

export const getSameParentMoveDirtyPaths = (
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

  if (!parentPath) {
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
  const firstOp = ops[0]
  const parentPath =
    firstOp.type === 'insert_node'
      ? Path.parent(firstOp.path)
      : Path.parent(firstOp.path)
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

  updateDirtyPaths(
    editor,
    ops.flatMap(op => editor.getDirtyPaths(op)),
    path => transformPathThroughOps(path, ops)
  )

  BATCH_LIVE_MERGE_OPS.delete(editor)
}

export const clearLiveMergeBatch = (editor: Editor) => {
  BATCH_LIVE_MERGE_OPS.delete(editor)
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
