import { PathRef } from '../interfaces/path-ref'
import { PointRef } from '../interfaces/point-ref'
import { Point } from '../interfaces/point'
import { RangeRef } from '../interfaces/range-ref'
import { Range } from '../interfaces/range'
import { Path } from '../interfaces/path'
import { Transforms } from '../interfaces/transforms'
import { Operation } from '../interfaces/operation'
import { Editor } from '../interfaces/editor'
import { batchDirtyPaths, isBatchingDirtyPaths } from './batching/dirty-paths'
import { withInternalBatchWrites } from './batch'
import { updateDirtyPaths } from './update-dirty-paths'

export const transformOperationPathRefs = (editor: Editor, op: Operation) => {
  for (const ref of Editor.pathRefs(editor)) {
    PathRef.transform(ref, op)
  }
}

export const transformOperationPointRefs = (editor: Editor, op: Operation) => {
  for (const ref of Editor.pointRefs(editor)) {
    PointRef.transform(ref, op)
  }
}

export const transformOperationRangeRefs = (editor: Editor, op: Operation) => {
  for (const ref of Editor.rangeRefs(editor)) {
    RangeRef.transform(ref, op)
  }
}

export const transformOperationRefs = (editor: Editor, op: Operation) => {
  transformOperationPathRefs(editor, op)
  transformOperationPointRefs(editor, op)
  transformOperationRangeRefs(editor, op)
}

export const transformOperationSelection = (editor: Editor, op: Operation) => {
  if (
    !editor.selection ||
    (op.type !== 'insert_text' && op.type !== 'remove_text')
  ) {
    return
  }

  const selection = { ...editor.selection }

  for (const [point, key] of Range.points(selection)) {
    selection[key] = Point.transform(point, op)!
  }

  if (!Range.equals(selection, editor.selection)) {
    editor.selection = selection
  }
}

export const transformOperationSelectionPoints = (
  editor: Editor,
  op: Operation
) => {
  if (!editor.selection) {
    return
  }

  const selection = { ...editor.selection }

  for (const [point, key] of Range.points(selection)) {
    selection[key] = Point.transform(point, op)!
  }

  if (!Range.equals(selection, editor.selection)) {
    editor.selection = selection
  }
}

export const updateOperationDirtyPaths = (editor: Editor, op: Operation) => {
  if (!isBatchingDirtyPaths(editor)) {
    const transform = Path.operationCanTransformPath(op)
      ? (path: Path) => Path.transform(path, op)
      : undefined

    updateDirtyPaths(editor, editor.getDirtyPaths(op), transform)
  }
}

export const transformOperationTree = (editor: Editor, op: Operation) => {
  withInternalBatchWrites(editor, () => {
    Transforms.transform(editor, op)
  })
}

export const finalizeOperation = (editor: Editor, op: Operation) => {
  editor.operations.push(op)
  Editor.normalize(editor, {
    operation: op,
  })

  if (op.type === 'set_selection') {
    editor.marks = null
  }
}

export const runOperation = (editor: Editor, op: Operation) => {
  transformOperationRefs(editor, op)
  transformOperationTree(editor, op)
  updateOperationDirtyPaths(editor, op)
  finalizeOperation(editor, op)
}

export const batchOperationDirtyPaths = ({
  editor,
  fn,
  applyDirtyPaths,
}: {
  editor: Editor
  fn: () => void
  applyDirtyPaths: () => void
}) => {
  batchDirtyPaths(editor, fn, applyDirtyPaths)
}
