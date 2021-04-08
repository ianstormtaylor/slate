import { BaseRange, BaseText } from 'slate'
import { ReactEditor } from './plugin/react-editor'
import { ReactNode, ReactNodeArray } from 'react'

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder: ReactNode | ReactNodeArray
    }
    Range: BaseRange & {
      placeholder?: ReactNode | ReactNodeArray
    }
  }
}
