import { Editor } from '../interfaces/editor'
import type { Node } from '../interfaces/node'
import type { Path } from '../interfaces/path'

export const matchPath = (
  editor: Editor,
  path: Path
): ((node: Node) => boolean) => {
  const [node] = Editor.node(editor, path)
  return (n) => n === node
}
