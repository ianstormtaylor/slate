import { Editor, Location } from '../interfaces'

/**
 * Get the default location to insert content into the editor.
 * By default, use the selection as the target location. But if there is
 * no selection, insert at the end of the document since that is such a
 * common use case when inserting from a non-selected state.
 */
export const getDefaultInsertLocation = (editor: Editor): Location => {
  if (editor.selection) {
    return editor.selection
  } else if (editor.children.length > 0) {
    return Editor.end(editor, [])!
  } else {
    return [0]
  }
}
