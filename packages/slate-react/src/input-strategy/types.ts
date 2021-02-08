import { Key, RefObject, TextareaHTMLAttributes } from 'react'

export interface InputStrategyArguments {
  nodeRef: RefObject<HTMLDivElement>
  readOnly: boolean
  handlers: {
    onDOMBeforeInput?: (event: Event) => void
  } & Pick<
    TextareaHTMLAttributes<HTMLDivElement>,
    'onBeforeInput' | 'onCompositionStart' | 'onCompositionEnd'
  >
}

export interface InputStrategyReturnValue {
  isComposing: RefObject<boolean>
  attributes: TextareaHTMLAttributes<HTMLDivElement> & {
    key?: Key
  }
}

export type InputStrategy = (
  args: InputStrategyArguments
) => InputStrategyReturnValue
