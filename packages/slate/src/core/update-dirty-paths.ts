import { DIRTY_PATH_KEYS, DIRTY_PATHS } from '../utils/weak-maps'
import { Path } from '../interfaces/path'
import { Editor } from '../interfaces/editor'

/**
 * update editor dirty paths
 *
 * @param newDirtyPaths: Path[]; new dirty paths
 * @param transform: (p: Path) => Path | null; how to transform existing dirty paths
 */
export function updateDirtyPaths(
  editor: Editor,
  newDirtyPaths: Path[],
  transform?: (p: Path) => Path | null
) {
  const oldDirtyPaths = DIRTY_PATHS.get(editor) || []
  const oldDirtyPathKeys = DIRTY_PATH_KEYS.get(editor) || new Set()
  let dirtyPaths: Path[]
  let dirtyPathKeys: Set<string>

  const add = (path: Path | null) => {
    if (path) {
      const key = path.join(',')

      if (!dirtyPathKeys.has(key)) {
        dirtyPathKeys.add(key)
        dirtyPaths.push(path)
      }
    }
  }

  if (transform) {
    dirtyPaths = []
    dirtyPathKeys = new Set()
    for (const path of oldDirtyPaths) {
      const newPath = transform(path)
      add(newPath)
    }
  } else {
    dirtyPaths = oldDirtyPaths
    dirtyPathKeys = oldDirtyPathKeys
  }

  for (const path of newDirtyPaths) {
    add(path)
  }

  DIRTY_PATHS.set(editor, dirtyPaths)
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
}
