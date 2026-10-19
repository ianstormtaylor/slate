import { DIRTY_PATH_KEYS, DIRTY_PATHS } from '../utils/weak-maps'
import { Path } from '../interfaces/path'
import { Editor } from '../interfaces/editor'

const SCAN_LIMIT = 8

/**
 * update editor dirty paths
 *
 * @param newDirtyPaths: Path[]; new dirty paths
 * @param transform: (p: Path) => Path | null; how to transform existing dirty paths
 */
export function updateDirtyPaths(
  editor: Editor,
  newDirtyPaths: Path[],
  transform?: (p: Path) => Path | null,
  distinct = false
) {
  let dirtyPaths = DIRTY_PATHS.get(editor) || []
  let dirtyPathKeys = DIRTY_PATH_KEYS.get(editor)

  const add = (path: Path | null) => {
    if (path) {
      const key = path.join(',')

      if (!dirtyPathKeys!.has(key)) {
        dirtyPathKeys!.add(key)
        dirtyPaths.push(path)
      }
    }
  }

  if (transform) {
    const oldDirtyPaths = dirtyPaths
    dirtyPaths = []

    if (distinct) {
      dirtyPathKeys = undefined

      for (const path of oldDirtyPaths) {
        const newPath = transform(path)

        if (newPath) {
          dirtyPaths.push(newPath)
        }
      }
    } else {
      dirtyPathKeys = new Set()

      for (const path of oldDirtyPaths) {
        add(transform(path))
      }
    }
  }

  if (
    !dirtyPathKeys &&
    (newDirtyPaths.length > SCAN_LIMIT ||
      (!transform && dirtyPaths.length > SCAN_LIMIT))
  ) {
    dirtyPathKeys = new Set(dirtyPaths.map(path => path.join(',')))
  }

  for (const path of newDirtyPaths) {
    if (dirtyPathKeys) {
      add(path)
    } else if (!dirtyPaths.some(dirtyPath => Path.equals(dirtyPath, path))) {
      dirtyPaths.push(path)
    }
  }

  DIRTY_PATHS.set(editor, dirtyPaths)

  if (dirtyPathKeys) {
    DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
  } else {
    DIRTY_PATH_KEYS.delete(editor)
  }
}
