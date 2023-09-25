import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { NodeEntry } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'

export const marks: EditorInterface['marks'] = (editor, options = {}) => {
  const { marks, selection } = editor

  if (!selection) {
    return null
  }

  if (marks) {
    return marks
  }

  if (Range.isExpanded(selection)) {
    const [match] = Editor.nodes(editor, { match: Text.isText })

    if (match) {
      const [node] = match as NodeEntry<Text>
      const { text, ...rest } = node
      return rest
    } else {
      return {}
    }
  }

  const { anchor } = selection
  const { path } = anchor
  const entry = Editor.leaf(editor, path)
  if (!entry) {
    return editor.onError({
      key: 'marks',
      message: 'Cannot get the leaf node',
      data: { at: path },
      recovery: {},
    })
  }

  let [node] = entry

  if (anchor.offset === 0) {
    const prev = Editor.previous(editor, { at: path, match: Text.isText })
    const markedVoid = Editor.above(editor, {
      match: n =>
        Element.isElement(n) &&
        Editor.isVoid(editor, n) &&
        editor.markableVoid(n),
    })
    if (!markedVoid) {
      const block = Editor.above(editor, {
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      })

      if (prev && block) {
        const [prevNode, prevPath] = prev
        const [, blockPath] = block

        if (Path.isAncestor(blockPath, prevPath)) {
          node = prevNode as Text
        }
      }
    }
  }

  const { text, ...rest } = node
  return rest
}
