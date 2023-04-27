import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { Node } from '../interfaces/node'

export const matchPath = (
  editor: Editor,
  path: Path
): ((node: Node) => boolean) => {
  const [node] = Editor.node(editor, path)!
  return n => n === node
}
