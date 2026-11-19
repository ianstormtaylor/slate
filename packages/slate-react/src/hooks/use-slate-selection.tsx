import { BaseSelection, Range } from 'slate'

import { useSlateSelector } from './use-slate-selector'

/**
 * Get the current editor selection. Only re-renders when the selection changes.
 * @group Hooks
 */
export const useSlateSelection = () => {
  return useSlateSelector(editor => editor.selection, isSelectionEqual)
}

const isSelectionEqual = (a: BaseSelection, b: BaseSelection) => {
  if (!a && !b) return true
  if (!a || !b) return false
  return Range.equals(a, b)
}
