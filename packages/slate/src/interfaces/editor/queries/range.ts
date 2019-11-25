import { Editor, Path, Range } from '../../..'

export const RangeQueries = {
  /**
   * Convert a range into a non-hanging one.
   */

  unhangRange(editor: Editor, range: Range): Range {
    let [start, end] = Range.edges(range)

    // PERF: exit early if we can guarantee that the range isn't hanging.
    if (start.offset !== 0 || end.offset !== 0 || Range.isCollapsed(range)) {
      return range
    }

    const closestBlock = Editor.match(editor, end.path, 'block')
    const blockPath = closestBlock ? closestBlock[1] : []
    const first = Editor.start(editor, [])
    const before = { anchor: first, focus: end }
    let skip = true

    for (const [node, path] of Editor.texts(editor, {
      at: before,
      reverse: true,
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
