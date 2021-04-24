import { MutableRefObject, RefObject } from 'react'
import { Editor } from 'slate'

export interface BaseArguments {
  attributes: any
  nodeRef: RefObject<HTMLElement>
  readOnly: boolean
}

export interface ReconcilerArguments extends BaseArguments {
  context: MutableRefObject<ReconcilerMutableContext>
  editor: Editor
}

export interface ReconcilerMutableContext {
  composition: {
    isComposing: boolean
  }
  selection: {
    isUpdating: boolean
  }
  latestElement: Element | undefined
}
