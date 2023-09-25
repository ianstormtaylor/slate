import { EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'

export const point: EditorInterface['point'] = (editor, at, options = {}) => {
  const { edge = 'start' } = options

  if (Path.isPath(at)) {
    let path

    if (edge === 'end') {
      const lastEntry = Node.last(editor, at)
      if (!lastEntry) {
        return editor.onError({
          key: 'point.last',
          message: 'Cannot find the last node',
          data: { at },
        })
      }
      const [, lastPath] = lastEntry
      path = lastPath
    } else {
      const firstEntry = Node.first(editor, at)
      if (!firstEntry) {
        return editor.onError({
          key: 'point.first',
          message: 'Cannot find the first node',
          data: { at },
        })
      }
      const [, firstPath] = firstEntry
      path = firstPath
    }

    const node = Node.get(editor, path)

    if (!Text.isText(node)) {
      return editor.onError({
        key: 'point.text',
        message: 'Cannot get the text node',
        data: { at },
      })
    }

    return { path, offset: edge === 'end' ? node.text.length : 0 }
  }

  if (Range.isRange(at)) {
    const [start, end] = Range.edges(at)
    return edge === 'start' ? start : end
  }

  return at
}
