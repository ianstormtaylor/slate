import { BaseRange, BaseText, Path } from 'slate'
import { ReactEditor } from './plugin/react-editor'

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder?: string
    }
    Range: BaseRange & {
      basePath?: Path
      placeholder?: string
    }
  }
}
