import { Editor } from '../../interfaces/editor'
import { Operation } from '../../interfaces/operation'
import { Path } from '../../interfaces/path'
import { DIRTY_PATH_KEYS, DIRTY_PATHS } from '../../utils/weak-maps'
import { batchOperationDirtyPaths } from '../apply-operation'
import { updateDirtyPaths } from '../update-dirty-paths'

const BATCHING_DIRTY_PATHS: WeakMap<Editor, boolean> = new WeakMap()

export const isBatchingDirtyPaths = (editor: Editor) => {
  return BATCHING_DIRTY_PATHS.get(editor) || false
}

export const batchDirtyPaths = (
  editor: Editor,
  fn: () => void,
  update: () => void
) => {
  const value = BATCHING_DIRTY_PATHS.get(editor) || false
  BATCHING_DIRTY_PATHS.set(editor, true)
  try {
    fn()
    update()
  } finally {
    BATCHING_DIRTY_PATHS.set(editor, value)
  }
}

export const transformPathThroughOps = (path: Path, ops: Operation[]) => {
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

export const calculateDirtyPathsAfterBatch = (
  editor: Editor,
  ops: Operation[]
) => {
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

export const applyDirtyPathBatchedOperations = ({
  editor,
  ops,
  newDirtyPaths,
  transformDirtyPath = (path: Path) => transformPathThroughOps(path, ops),
}: {
  editor: Editor
  ops: Operation[]
  newDirtyPaths: Path[]
  transformDirtyPath?: (path: Path) => Path | null
}) => {
  batchOperationDirtyPaths({
    editor,
    fn: () => {
      Editor.withBatch(editor, () => {
        for (const op of ops) {
          editor.apply(op)
        }

        updateDirtyPaths(editor, newDirtyPaths, transformDirtyPath)
      })
    },
    applyDirtyPaths: () => {},
  })
}
