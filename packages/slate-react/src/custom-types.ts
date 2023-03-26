import { BaseRange, BaseText } from 'slate'
import { ReactEditor } from './plugin/react-editor'

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder?: string
      onPlaceholderResize?: (node: HTMLElement | null) => void
    }
    Range: BaseRange & {
      placeholder?: string
      onPlaceholderResize?: (node: HTMLElement | null) => void
    }
  }
}
