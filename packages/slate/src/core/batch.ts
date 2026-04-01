import { Editor, EditorNormalizeOptions } from '../interfaces/editor'
import { commitDraftChildren } from './children'
import {
  flushLiveInsertMoveBatch,
  flushLiveMergeBatch,
  flushLiveMoveBatch,
  flushLiveSplitBatch,
} from './batching/live-dirty-paths'
import {
  BATCH_DEPTH,
  BATCH_INTERNAL_READ_DEPTH,
  BATCH_INTERNAL_WRITE_DEPTH,
  BATCH_OBSERVE_NORMALIZE_DEPTH,
  BATCH_NORMALIZE,
  BATCH_PENDING_FLUSH,
  DIRTY_PATHS,
  FLUSHING,
} from '../utils/weak-maps'

// Batch lifecycle and observation barriers live here. Planner and executor
// details stay under ./batching/ so this file answers "when does a batch run?"
// instead of "how does each batch family work?"
export type BatchTracePhase =
  | 'flushBeforeNormalize'
  | 'commitBeforeNormalize'
  | 'normalize'
  | 'flushAfterNormalize'
  | 'commitAfterNormalize'

type BatchTraceHooks = {
  onPhaseEnd?: (phase: BatchTracePhase) => void
  onPhaseStart?: (phase: BatchTracePhase) => void
}

const BATCH_TRACE_HOOKS: WeakMap<Editor, BatchTraceHooks> = new WeakMap()

const getBatchDepth = (editor: Editor) => BATCH_DEPTH.get(editor) ?? 0

export const isBatching = (editor: Editor) => getBatchDepth(editor) > 0

const getInternalBatchReadDepth = (editor: Editor) =>
  BATCH_INTERNAL_READ_DEPTH.get(editor) ?? 0

export const isReadingBatchInternals = (editor: Editor) =>
  getInternalBatchReadDepth(editor) > 0

const getInternalBatchWriteDepth = (editor: Editor) =>
  BATCH_INTERNAL_WRITE_DEPTH.get(editor) ?? 0

export const isWritingBatchInternals = (editor: Editor) =>
  getInternalBatchWriteDepth(editor) > 0

export const withInternalBatchReads = <T>(editor: Editor, fn: () => T): T => {
  const depth = getInternalBatchReadDepth(editor)

  BATCH_INTERNAL_READ_DEPTH.set(editor, depth + 1)

  try {
    return fn()
  } finally {
    if (depth === 0) {
      BATCH_INTERNAL_READ_DEPTH.delete(editor)
    } else {
      BATCH_INTERNAL_READ_DEPTH.set(editor, depth)
    }
  }
}

export const withInternalBatchWrites = <T>(editor: Editor, fn: () => T): T => {
  const depth = getInternalBatchWriteDepth(editor)

  BATCH_INTERNAL_WRITE_DEPTH.set(editor, depth + 1)

  try {
    return fn()
  } finally {
    if (depth === 0) {
      BATCH_INTERNAL_WRITE_DEPTH.delete(editor)
    } else {
      BATCH_INTERNAL_WRITE_DEPTH.set(editor, depth)
    }
  }
}

const getObservedBatchNormalizeDepth = (editor: Editor) =>
  BATCH_OBSERVE_NORMALIZE_DEPTH.get(editor) ?? 0

export const isObservingBatchNormalize = (editor: Editor) =>
  getObservedBatchNormalizeDepth(editor) > 0

export const withObservedBatchNormalize = <T>(
  editor: Editor,
  fn: () => T
): T => {
  const depth = getObservedBatchNormalizeDepth(editor)

  BATCH_OBSERVE_NORMALIZE_DEPTH.set(editor, depth + 1)

  try {
    return fn()
  } finally {
    if (depth === 0) {
      BATCH_OBSERVE_NORMALIZE_DEPTH.delete(editor)
    } else {
      BATCH_OBSERVE_NORMALIZE_DEPTH.set(editor, depth)
    }
  }
}

export const withBatchTrace = <T>(
  editor: Editor,
  hooks: BatchTraceHooks,
  fn: () => T
): T => {
  const previous = BATCH_TRACE_HOOKS.get(editor)

  BATCH_TRACE_HOOKS.set(editor, hooks)

  try {
    return fn()
  } finally {
    if (previous) {
      BATCH_TRACE_HOOKS.set(editor, previous)
    } else {
      BATCH_TRACE_HOOKS.delete(editor)
    }
  }
}

const traceBatchPhase = <T>(
  editor: Editor,
  phase: BatchTracePhase,
  fn: () => T
): T => {
  const hooks = BATCH_TRACE_HOOKS.get(editor)

  hooks?.onPhaseStart?.(phase)

  try {
    return fn()
  } finally {
    hooks?.onPhaseEnd?.(phase)
  }
}

const flushLiveBatchState = (editor: Editor) => {
  flushLiveInsertMoveBatch(editor)
  flushLiveMergeBatch(editor)
  flushLiveMoveBatch(editor)
  flushLiveSplitBatch(editor)
}

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

export const getQueuedBatchNormalize = (editor: Editor) =>
  BATCH_NORMALIZE.get(editor)

export const clearQueuedBatchNormalize = (editor: Editor) => {
  BATCH_NORMALIZE.delete(editor)
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
      traceBatchPhase(editor, 'flushBeforeNormalize', () => {
        flushLiveBatchState(editor)
      })
      traceBatchPhase(editor, 'commitBeforeNormalize', () => {
        commitDraftChildren(editor)
      })

      const normalizeOptions = BATCH_NORMALIZE.get(editor)

      clearQueuedBatchNormalize(editor)

      if (normalizeOptions) {
        BATCH_DEPTH.set(editor, 1)

        try {
          let shouldForce = normalizeOptions.force
          let operation =
            editor.operations.length === 1
              ? normalizeOptions.operation
              : undefined

          do {
            traceBatchPhase(editor, 'normalize', () => {
              withObservedBatchNormalize(editor, () => {
                Editor.normalize(editor, {
                  force: shouldForce,
                  operation,
                })
              })
            })

            traceBatchPhase(editor, 'flushAfterNormalize', () => {
              flushLiveBatchState(editor)
            })
            traceBatchPhase(editor, 'commitAfterNormalize', () => {
              commitDraftChildren(editor)
            })

            shouldForce = false
            operation = undefined
          } while ((DIRTY_PATHS.get(editor)?.length ?? 0) > 0)
        } finally {
          BATCH_DEPTH.delete(editor)
        }
      }

      if (BATCH_PENDING_FLUSH.get(editor) || editor.operations.length > 0) {
        BATCH_PENDING_FLUSH.delete(editor)
        scheduleOnChange(editor)
      }
    }
  }
}
