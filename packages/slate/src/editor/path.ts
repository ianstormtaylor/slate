import { EditorInterface, Node, Path, Point, Range } from '../interfaces'

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
