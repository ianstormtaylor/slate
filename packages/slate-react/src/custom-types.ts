import { BaseRange, BaseText } from 'slate-latest'
import { ReactEditor } from './plugin/react-editor'

declare module 'slate-latest' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder?: string
    }
    Range: BaseRange & {
      placeholder?: string
    }
  }
}
