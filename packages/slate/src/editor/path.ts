import {
  type EditorInterface,
  Location,
  Node,
  Path,
  Range,
} from '../interfaces'

export const path: EditorInterface['path'] = (editor, at, options = {}) => {
  const { depth, edge } = options
  let resolvedAt = at

  if (Location.isPath(resolvedAt)) {
    if (edge === 'start') {
      const [, firstPath] = Node.first(editor, resolvedAt)
      resolvedAt = firstPath
    } else if (edge === 'end') {
      const [, lastPath] = Node.last(editor, resolvedAt)
      resolvedAt = lastPath
    }
  }

  if (Location.isRange(resolvedAt)) {
    if (edge === 'start') {
      resolvedAt = Range.start(resolvedAt)
    } else if (edge === 'end') {
      resolvedAt = Range.end(resolvedAt)
    } else {
      resolvedAt = Path.common(resolvedAt.anchor.path, resolvedAt.focus.path)
    }
  }

  if (Location.isPoint(resolvedAt)) {
    resolvedAt = resolvedAt.path
  }

  if (depth != null) {
    resolvedAt = resolvedAt.slice(0, depth)
  }

  return resolvedAt
}
