import { BaseRange, BaseText } from 'slate'
import { ReactEditor } from './plugin/react-editor'

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder: string | JSX.Element
    }
    Range: BaseRange & {
      placeholder?: string | JSX.Element
    }
  }
}
