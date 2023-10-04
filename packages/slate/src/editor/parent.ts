import { Editor, EditorInterface } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { Ancestor, NodeEntry } from '../interfaces/node'

export const parent: EditorInterface['parent'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  const parentPath = Path.parent(path)
  const entry = Editor.node(editor, parentPath)
  return entry as NodeEntry<Ancestor>
}
