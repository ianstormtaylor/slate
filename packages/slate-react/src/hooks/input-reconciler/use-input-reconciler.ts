import { useMemo, useRef } from 'react'

import { useSlateStatic } from '../use-slate-static'
import { useClipboardReconciler } from './clipboard'
import { useCompositionReconciler } from './composition'
import { useDragAndDropReconciler } from './drag-and-drop'
import { useFocusReconciler } from './focus'
import { useSelectionReconciler } from './selection'

import { BaseArguments, ReconcilerMutableContext } from './types'

interface Arguments extends BaseArguments {}

export function useInputReconciler({
  attributes,
  nodeRef,
  readOnly,
}: Arguments) {
  const editor = useSlateStatic()
  const reconcilerMutableContext = useRef<ReconcilerMutableContext>({
    composition: {
      isComposing: false,
    },
    selection: {
      isUpdating: false,
    },
    latestElement: undefined,
  })
  const reconcilerArguments = useMemo(
    () => ({
      attributes,
      context: reconcilerMutableContext,
      editor,
      nodeRef,
      readOnly,
    }),
    [attributes, editor, nodeRef, readOnly]
  )

  const { handlers: compositionHandlers } = useCompositionReconciler(
    reconcilerArguments
  )
  const { handlers: clipboardHandlers } = useClipboardReconciler(
    reconcilerArguments
  )
  const { handlers: dragAndDropHandlers } = useDragAndDropReconciler(
    reconcilerArguments
  )
  const { handlers: focusHandlers } = useFocusReconciler(reconcilerArguments)
  useSelectionReconciler(reconcilerArguments)

  return {
    handlers: {
      ...compositionHandlers,
      ...clipboardHandlers,
      ...dragAndDropHandlers,
      ...focusHandlers,
    },
  }
}
