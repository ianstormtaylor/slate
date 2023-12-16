import { Node, NodeEntry } from '../interfaces/node'
import { Editor, EditorLevelsOptions } from '../interfaces/editor'
import { Element } from '../interfaces/element'

export function* levels<T extends Node>(
  editor: Editor,
  options: EditorLevelsOptions<T> = {}
): Generator<NodeEntry<T>, void, undefined> {
  const { at = editor.selection, reverse = false, voids = false } = options
  let { match } = options

  if (match == null) {
    match = () => true
  }

  if (!at) {
    return
  }

  const levels: NodeEntry<T>[] = []
  const path = Editor.path(editor, at)

  for (const [n, p] of Node.levels(editor, path)) {
    if (!match(n, p)) {
      continue
    }

    levels.push([n, p] as NodeEntry<T>)

    if (!voids && Element.isElement(n) && Editor.isVoid(editor, n)) {
      break
    }
  }

  if (reverse) {
    levels.reverse()
  }

  yield* levels
}
