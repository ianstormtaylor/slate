import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'

export const unhangRange: EditorInterface['unhangRange'] = (
  editor,
  range,
  options = {}
) => {
  const { voids = false } = options
  let [start, end] = Range.edges(range)

  // PERF: exit early if we can guarantee that the range isn't hanging.
  if (
    start.offset !== 0 ||
    end.offset !== 0 ||
    Range.isCollapsed(range) ||
    Path.hasPrevious(end.path)
  ) {
    return range
  }

  const endBlock = Editor.above(editor, {
    at: end,
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    voids,
  })
  const blockPath = endBlock ? endBlock[1] : []
  const first = Editor.start(editor, start)
  if (!first) {
    return editor.onError({
      key: 'unhangRange.start',
      message: 'Cannot find the start point',
      data: { at: start },
      recovery: range,
    })
  }
  const before = { anchor: first, focus: end }
  let skip = true

  for (const [node, path] of Editor.nodes(editor, {
    at: before,
    match: Text.isText,
    reverse: true,
    voids,
  })) {
    if (skip) {
      skip = false
      continue
    }

    if (node.text !== '' || Path.isBefore(path, blockPath)) {
      end = { path, offset: node.text.length }
      break
    }
  }

  return { anchor: start, focus: end }
}
