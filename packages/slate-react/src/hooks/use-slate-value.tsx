import { Range } from 'slate'

import { useSlateSelector } from './use-slate-selector'

/**
 * Get the current slate value (editor.children).
 * Only triggers a rerender when the editor.children actually changes
 */
export const useSlateValue = () => {
  return useSlateSelector(
    editor => editor.children,
  )
}
