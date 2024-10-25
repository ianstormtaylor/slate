import { DOMEditor, type DOMEditorInterface } from 'slate-dom'

/**
 * A React and DOM-specific version of the `Editor` interface.
 */

export interface ReactEditor extends DOMEditor {}

export interface ReactEditorInterface extends DOMEditorInterface {}

export const ReactEditor: ReactEditorInterface = DOMEditor
