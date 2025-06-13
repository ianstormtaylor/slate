import { PathRef } from '../interfaces/path-ref'
import { PointRef } from '../interfaces/point-ref'
import { RangeRef } from '../interfaces/range-ref'
import { FLUSHING, FLUSHING_SELECTION } from '../utils/weak-maps'
import { Path } from '../interfaces/path'
import { Transforms } from '../interfaces/transforms'
import { WithEditorFirstArg } from '../utils/types'
import { Editor } from '../interfaces/editor'
import { isBatchingDirtyPaths } from './batch-dirty-paths'
import { updateDirtyPaths } from './update-dirty-paths'

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

  // update dirty paths
  if (!isBatchingDirtyPaths(editor)) {
    const transform = Path.operationCanTransformPath(op)
      ? (p: Path) => Path.transform(p, op)
      : undefined
    updateDirtyPaths(editor, editor.getDirtyPaths(op), transform)
  }

  Transforms.transform(editor, op)
  editor.operations.push(op)
  Editor.normalize(editor, {
    operation: op,
  })

  // Clear any formats applied to the cursor if the selection changes.
  if (op.type === 'set_selection') {
    editor.marks = null
  }

  const flushing = op.type === 'set_selection' ? FLUSHING_SELECTION : FLUSHING

  if (!flushing.get(editor)) {
    flushing.set(editor, true)

    Promise.resolve().then(() => {
      flushing.set(editor, false)
      editor.onChange({ operation: op })
      editor.operations = []
    })
  }
}
