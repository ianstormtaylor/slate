import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { PathRef } from '../interfaces/path-ref'
import { PointRef } from '../interfaces/point-ref'
import { RangeRef } from '../interfaces/range-ref'
import { Transforms } from '../interfaces/transforms'
import { WithEditorFirstArg } from '../utils/types'
import { DIRTY_PATH_KEYS, DIRTY_PATHS, FLUSHING } from '../utils/weak-maps'

export const apply: WithEditorFirstArg<Editor['apply']> = (editor, op) => {
  for (const ref of Editor.pathRefs(editor)) {
    PathRef.transform(ref, op)
  }

  for (const ref of Editor.pointRefs(editor)) {
    PointRef.transform(ref, op)
  }

  for (const ref of Editor.rangeRefs(editor)) {
    RangeRef.transform(ref, op)
  }

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

  if (Path.operationCanTransformPath(op)) {
    dirtyPaths = []
    dirtyPathKeys = new Set()
    for (const path of oldDirtyPaths) {
      const newPath = Path.transform(path, op)
      add(newPath)
    }
  } else {
    dirtyPaths = oldDirtyPaths
    dirtyPathKeys = oldDirtyPathKeys
  }

  const newDirtyPaths = editor.getDirtyPaths(op)
  for (const path of newDirtyPaths) {
    add(path)
  }

  DIRTY_PATHS.set(editor, dirtyPaths)
  DIRTY_PATH_KEYS.set(editor, dirtyPathKeys)
  Transforms.transform(editor, op)
  editor.operations.push(op)
  Editor.normalize(editor, {
    operation: op,
  })

  // Clear any formats applied to the cursor if the selection changes.
  if (op.type === 'set_selection') {
    editor.marks = null
  }

  if (!FLUSHING.get(editor)) {
    FLUSHING.set(editor, true)

    Promise.resolve().then(() => {
      FLUSHING.set(editor, false)
      editor.onChange({ operation: op })
      editor.operations = []
    })
  }
}
