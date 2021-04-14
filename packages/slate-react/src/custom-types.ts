import { BaseRange, BaseText } from 'slate'
import { RenderPlaceholderProps } from './components/leaf'
import { ReactEditor } from './plugin/react-editor'

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      placeholder: string | ((props: RenderPlaceholderProps) => JSX.Element)
    }
    Range: BaseRange & {
      placeholder?: string | ((props: RenderPlaceholderProps) => JSX.Element)
    }
  }
}
