import { Range } from 'slate'

import { useSlateSelector } from "./use-slate-selector"

/**
 * Get the current slate selection.
 * Only triggers a rerender when the selection actually changes
 */
export const useSlateSelection = () => {
  return useSlateSelector(
    editor => editor.selection,
    (a, b) => {
      if (!a && !b) return true
      if (!a || !b) return false
      return Range.equals(a, b)
    }
  )
}
