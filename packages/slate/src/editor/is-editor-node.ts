import { Editor, EditorInterface, Node } from '../interfaces'

export const isEditorNode: EditorInterface['isEditorNode'] = (
  node: Node
): node is Editor => {
  return typeof (node as Editor).apply === 'function'
}
