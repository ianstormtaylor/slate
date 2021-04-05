import { Editor, Value } from 'slate'
import { History } from './history'

/**
 * Weakmaps for attaching state to the editor.
 */

export const HISTORY = new WeakMap<HistoryEditor<Value>, History>()
export const SAVING = new WeakMap<HistoryEditor<Value>, boolean | undefined>()
export const MERGING = new WeakMap<HistoryEditor<Value>, boolean | undefined>()

/**
 * `HistoryEditor` contains helpers for history-enabled editors.
 */

export type HistoryEditor<V extends Value> = Editor<V> & {
  history: History
  undo: () => void
  redo: () => void
}

export const HistoryEditor = {
  /**
   * Check if a value is a `HistoryEditor` object.
   */

  isHistoryEditor(value: any): value is HistoryEditor<Value> {
    return History.isHistory(value.history) && Editor.isEditor(value)
  },

  /**
   * Get the merge flag's current value.
   */

  isMerging<V extends Value>(editor: HistoryEditor<V>): boolean | undefined {
    return MERGING.get(editor)
  },

  /**
   * Get the saving flag's current value.
   */

  isSaving<V extends Value>(editor: HistoryEditor<V>): boolean | undefined {
    return SAVING.get(editor)
  },

  /**
   * Redo to the previous saved state.
   */

  redo<V extends Value>(editor: HistoryEditor<V>): void {
    editor.redo()
  },

  /**
   * Undo to the previous saved state.
   */

  undo<V extends Value>(editor: HistoryEditor<V>): void {
    editor.undo()
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   */

  withoutMerging<V extends Value>(
    editor: HistoryEditor<V>,
    fn: () => void
  ): void {
    const prev = HistoryEditor.isMerging(editor)
    MERGING.set(editor, false)
    fn()
    MERGING.set(editor, prev)
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   */

  withoutSaving<V extends Value>(
    editor: HistoryEditor<V>,
    fn: () => void
  ): void {
    const prev = HistoryEditor.isSaving(editor)
    SAVING.set(editor, false)
    fn()
    SAVING.set(editor, prev)
  },
}
