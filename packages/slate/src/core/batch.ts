import { Editor, EditorNormalizeOptions } from '../interfaces/editor'
import { commitDraftChildren } from './children'
import {
  BATCH_DEPTH,
  BATCH_NORMALIZE,
  BATCH_PENDING_FLUSH,
  FLUSHING,
} from '../utils/weak-maps'

const getBatchDepth = (editor: Editor) => BATCH_DEPTH.get(editor) ?? 0

export const isBatching = (editor: Editor) => getBatchDepth(editor) > 0

export const wrapApply = <T extends Editor>(
  editor: T,
  wrapper: (apply: T['apply']) => T['apply']
) => {
  const apply = editor.apply as T['apply']
  const wrapped = wrapper(apply)

  editor.apply = wrapped

  return wrapped
}

export const queueBatchNormalize = (
  editor: Editor,
  options: EditorNormalizeOptions = {}
) => {
  const pending = BATCH_NORMALIZE.get(editor) ?? {}

  if (options.force) {
    pending.force = true
  }

  if (options.operation) {
    pending.operation = options.operation
  }

  BATCH_NORMALIZE.set(editor, pending)
}

const flushOnChange = (editor: Editor) => {
  FLUSHING.set(editor, false)

  const options =
    editor.operations.length === 1
      ? { operation: editor.operations[0] }
      : undefined

  editor.onChange(options)
  editor.operations = []
}

export const scheduleOnChange = (editor: Editor) => {
  if (isBatching(editor)) {
    BATCH_PENDING_FLUSH.set(editor, true)
    return
  }

  if (FLUSHING.get(editor)) {
    return
  }

  FLUSHING.set(editor, true)

  Promise.resolve().then(() => {
    flushOnChange(editor)
  })
}

export const withBatch = (editor: Editor, fn: () => void) => {
  const depth = getBatchDepth(editor)
  const isNestedBatch = depth > 0

  BATCH_DEPTH.set(editor, depth + 1)

  try {
    fn()
  } finally {
    if (isNestedBatch) {
      BATCH_DEPTH.set(editor, depth)
    } else {
      BATCH_DEPTH.delete(editor)
      commitDraftChildren(editor)

      const normalizeOptions = BATCH_NORMALIZE.get(editor)

      BATCH_NORMALIZE.delete(editor)

      if (normalizeOptions) {
        Editor.normalize(editor, {
          force: normalizeOptions.force,
          operation:
            editor.operations.length === 1
              ? normalizeOptions.operation
              : undefined,
        })
      }

      if (BATCH_PENDING_FLUSH.get(editor) || editor.operations.length > 0) {
        BATCH_PENDING_FLUSH.delete(editor)
        scheduleOnChange(editor)
      }
    }
  }
}
