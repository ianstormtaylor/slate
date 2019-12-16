import { Editor, Text, Path, Range } from '../../..'

export const RangeQueries = {
  /**
   * Convert a range into a non-hanging one.
   */

  unhangRange(
    editor: Editor,
    range: Range,
    options: {
      voids?: boolean
    } = {}
  ): Range {
    const { voids = false } = options
    let [start, end] = Range.edges(range)

    // PERF: exit early if we can guarantee that the range isn't hanging.
    if (start.offset !== 0 || end.offset !== 0 || Range.isCollapsed(range)) {
      return range
    }

    const endBlock = Editor.above(editor, {
      at: end,
      match: n => Editor.isBlock(editor, n),
    })
    const blockPath = endBlock ? endBlock[1] : []
    const first = Editor.start(editor, [])
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
  },
}
