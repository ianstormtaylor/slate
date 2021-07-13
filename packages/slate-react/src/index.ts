// Components
// Environment-dependent Editable
import { Editable as DefaultEditable } from './components/editable'
import { AndroidEditable } from './components/android/android-editable'
import { IS_ANDROID } from './utils/environment'

export const Editable = IS_ANDROID ? AndroidEditable : DefaultEditable
export {
  Editable as DefaultEditable,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  DefaultPlaceholder,
} from './components/editable'
export { AndroidEditable } from './components/android/android-editable'
export { DefaultElement } from './components/element'
export { DefaultLeaf } from './components/leaf'
export { Slate } from './components/slate'

// Hooks
export { useEditor } from './hooks/use-editor'
export { useSlateStatic } from './hooks/use-slate-static'
export { useFocused } from './hooks/use-focused'
export { useReadOnly } from './hooks/use-read-only'
export { useSelected } from './hooks/use-selected'
export { useSlate } from './hooks/use-slate'

// Plugin
export { ReactEditor } from './plugin/react-editor'
export { withReact } from './plugin/with-react'
