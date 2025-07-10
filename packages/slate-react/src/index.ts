// Components
export {
  Editable,
  RenderElementProps,
  RenderChunkProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  DefaultPlaceholder,
  defaultScrollSelectionIntoView,
} from './components/editable'

export { DefaultElement } from './components/element'
export { DefaultText } from './components/text'
export { DefaultLeaf } from './components/leaf'
export { Slate } from './components/slate'

// Hooks
export { useEditor } from './hooks/use-editor'
export { useElement, useElementIf } from './hooks/use-element'
export { useSlateStatic } from './hooks/use-slate-static'
export { useComposing } from './hooks/use-composing'
export { useFocused } from './hooks/use-focused'
export { useReadOnly } from './hooks/use-read-only'
export { useSelected } from './hooks/use-selected'
export { useSlate, useSlateWithV } from './hooks/use-slate'
export { useSlateSelector } from './hooks/use-slate-selector'
export { useSlateSelection } from './hooks/use-slate-selection'

// Plugin
export { ReactEditor } from './plugin/react-editor'
export { withReact } from './plugin/with-react'

// Utils
export { NODE_TO_INDEX, NODE_TO_PARENT } from 'slate-dom'
