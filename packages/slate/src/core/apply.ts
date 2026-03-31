import { PathRef } from '../interfaces/path-ref'
import { PointRef } from '../interfaces/point-ref'
import { RangeRef } from '../interfaces/range-ref'
import { Path } from '../interfaces/path'
import { Transforms } from '../interfaces/transforms'
import { WithEditorFirstArg } from '../utils/types'
import { Operation } from '../interfaces/operation'
import { Editor } from '../interfaces/editor'
import { isBatchingDirtyPaths } from './batch-dirty-paths'
import { isBatching, scheduleOnChange } from './batch'
import {
  commitExactSetNodeDraft,
  hasDraftChildren,
  hasExactSetNodeDraft,
  promoteExactSetNodeDraftToDraftChildren,
  stageExactSetNodeOperation,
} from './children'
import { updateDirtyPaths } from './update-dirty-paths'

export const transformOperationPathRefs = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  for (const ref of Editor.pathRefs(editor)) {
    PathRef.transform(ref, op)
  }
}

export const transformOperationPointRefs = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  for (const ref of Editor.pointRefs(editor)) {
    PointRef.transform(ref, op)
  }
}

export const transformOperationRangeRefs = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  for (const ref of Editor.rangeRefs(editor)) {
    RangeRef.transform(ref, op)
  }
}

export const transformOperationRefs = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  transformOperationPathRefs(editor, op)
  transformOperationPointRefs(editor, op)
  transformOperationRangeRefs(editor, op)
}

export const updateOperationDirtyPaths = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  if (!isBatchingDirtyPaths(editor)) {
    const transform = Path.operationCanTransformPath(op)
      ? (p: Path) => Path.transform(p, op)
      : undefined
    updateDirtyPaths(editor, editor.getDirtyPaths(op), transform)
  }
}

export const transformOperationTree = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  Transforms.transform(editor, op)
}

export const finalizeOperation = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  editor.operations.push(op)
  Editor.normalize(editor, {
    operation: op,
  })

  // Clear any formats applied to the cursor if the selection changes.
  if (op.type === 'set_selection') {
    editor.marks = null
  }
}

export const applyOperationPhases = (
  editor: Editor,
  op: Parameters<Editor['apply']>[0]
) => {
  transformOperationRefs(editor, op)
  updateOperationDirtyPaths(editor, op)
  transformOperationTree(editor, op)
  finalizeOperation(editor, op)
}

export const applyOperationInBatch: WithEditorFirstArg<Editor['apply']> = (
  editor,
  op
) => {
  if (op.type === 'set_node' && !hasDraftChildren(editor)) {
    transformOperationRefs(editor, op)
    updateOperationDirtyPaths(editor, op)
    stageExactSetNodeOperation(editor, op)
    finalizeOperation(editor, op)
    return
  }

  if (hasExactSetNodeDraft(editor)) {
    promoteExactSetNodeDraftToDraftChildren(editor)
  }

  applyOperationPhases(editor, op)
}

export const applyOperationBatch = (editor: Editor, ops: Operation[]) => {
  if (ops.length === 0) {
    return
  }

  Editor.withBatch(editor, () => {
    for (const op of ops) {
      editor.apply(op)
    }
  })
}

export const applyOperationNormally: WithEditorFirstArg<Editor['apply']> = (
  editor,
  op
) => {
  applyOperationPhases(editor, op)
  scheduleOnChange(editor)
}

export const apply: WithEditorFirstArg<Editor['apply']> = (editor, op) => {
  if (isBatching(editor)) {
    applyOperationInBatch(editor, op)
    return
  }

  applyOperationNormally(editor, op)
}
