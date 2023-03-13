import { Editor, EditorInterface } from './interfaces/editor'
import { Node, NodeEntry } from './interfaces/node'
import { Range } from './interfaces/range'
import { Point } from './interfaces/point'
import { Path } from './interfaces/path'
import { Text } from './interfaces/text'
import { Element } from './interfaces/element'

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
  let [node] = Editor.leaf(editor, path)

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

export const path: EditorInterface['path'] = (editor, at, options = {}) => {
  const { depth, edge } = options

  if (Path.isPath(at)) {
    if (edge === 'start') {
      const [, firstPath] = Node.first(editor, at)
      at = firstPath
    } else if (edge === 'end') {
      const [, lastPath] = Node.last(editor, at)
      at = lastPath
    }
  }

  if (Range.isRange(at)) {
    if (edge === 'start') {
      at = Range.start(at)
    } else if (edge === 'end') {
      at = Range.end(at)
    } else {
      at = Path.common(at.anchor.path, at.focus.path)
    }
  }

  if (Point.isPoint(at)) {
    at = at.path
  }

  if (depth != null) {
    at = at.slice(0, depth)
  }

  return at
}
