import { PathRef } from '../interfaces/path-ref'
import { PointRef } from '../interfaces/point-ref'
import { RangeRef } from '../interfaces/range-ref'
import { FLUSHING } from '../utils/weak-maps'
import { Path } from '../interfaces/path'
import { Transforms } from '../interfaces/transforms'
import { WithEditorFirstArg } from '../utils/types'
import { Editor } from '../interfaces/editor'
import { isBatchingDirtyPaths } from './batch-dirty-paths'
import { updateDirtyPaths } from './update-dirty-paths'

export const apply: WithEditorFirstArg<Editor['apply']> = (editor, op) => {
  const changedRefs: Array<PathRef | PointRef | RangeRef> = []

  for (const ref of Editor.pathRefs(editor)) {
    if (PathRef.transform(ref, op)) {
      changedRefs.push(ref)
    }
  }

  for (const ref of Editor.pointRefs(editor)) {
    if (PointRef.transform(ref, op)) {
      changedRefs.push(ref)
    }
  }

  for (const ref of Editor.rangeRefs(editor)) {
    if (RangeRef.transform(ref, op)) {
      changedRefs.push(ref)
    }
  }

  // update dirty paths
  if (!isBatchingDirtyPaths(editor)) {
    const transform = Path.operationCanTransformPath(op)
      ? (p: Path) => Path.transform(p, op)
      : undefined
    updateDirtyPaths(editor, editor.getDirtyPaths(op), transform)
  }

  Transforms.transform(editor, op)
  changedRefs.forEach(ref => {
    ref.onChange()
  })
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
