import { EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { Range } from '../interfaces/range'
import { Location } from '../interfaces'

export const point: EditorInterface['point'] = (editor, at, options = {}) => {
  const { edge = 'start' } = options

  if (Location.isPath(at)) {
    let path

    if (edge === 'end') {
      const [, lastPath] = Node.last(editor, at)
      path = lastPath
    } else {
      const [, firstPath] = Node.first(editor, at)
      path = firstPath
    }

    const node = Node.get(editor, path)

    if (!Node.isText(node)) {
      throw new Error(
        `Cannot get the ${edge} point in the node at path [${at}] because it has no ${edge} text node.`
      )
    }

    return { path, offset: edge === 'end' ? node.text.length : 0 }
  }

  if (Location.isRange(at)) {
    const [start, end] = Range.edges(at)
    return edge === 'start' ? start : end
  }

  return at
}
