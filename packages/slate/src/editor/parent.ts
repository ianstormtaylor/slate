import { Editor, type EditorInterface } from '../interfaces/editor'
import type { Ancestor, NodeEntry } from '../interfaces/node'
import { Path } from '../interfaces/path'

export const parent: EditorInterface['parent'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  const parentPath = Path.parent(path)
  const entry = Editor.node(editor, parentPath)
  return entry as NodeEntry<Ancestor>
}
