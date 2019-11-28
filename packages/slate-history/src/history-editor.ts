import { Editor } from 'slate'
import { History } from './history'

/**
 * Weakmaps for attaching state to the editor.
 */

export const HISTORY = new WeakMap<Editor, History>()
export const SAVING = new WeakMap<Editor, boolean | undefined>()
export const MERGING = new WeakMap<Editor, boolean | undefined>()

/**
 * `HistoryEditor` contains helpers for history-enabled editors.
 */

export interface HistoryEditor extends Editor {
  history: History
}

export const HistoryEditor = {
  /**
   * Check if a value is a `HistoryEditor` object.
   */

  isHistoryEditor(value: any): value is HistoryEditor {
    return Editor.isEditor(value) && History.isHistory(value.history)
  },

  /**
   * Get the merge flag's current value.
   */

  isMerging(editor: Editor): boolean | undefined {
    return MERGING.get(editor)
  },

  /**
   * Get the saving flag's current value.
   */

  isSaving(editor: Editor): boolean | undefined {
    return SAVING.get(editor)
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   */

  withoutMerging(editor: Editor, fn: () => void): void {
    const prev = HistoryEditor.isMerging(editor)
    MERGING.set(editor, false)
    fn()
    MERGING.set(editor, prev)
  },

  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   */

  withoutSaving(editor: Editor, fn: () => void): void {
    const prev = HistoryEditor.isSaving(editor)
    SAVING.set(editor, false)
    fn()
    SAVING.set(editor, prev)
  },
}
