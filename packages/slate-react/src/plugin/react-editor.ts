import { DOMEditor } from 'slate-dom'
import { DOMEditorInterface } from 'slate-dom/dist/plugin/dom-editor'

/**
 * A React and DOM-specific version of the `Editor` interface.
 */

export interface ReactEditor extends DOMEditor {}

export interface ReactEditorInterface extends DOMEditorInterface {}

export const ReactEditor: ReactEditorInterface = DOMEditor
