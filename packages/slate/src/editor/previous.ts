import { Editor, EditorInterface } from '../interfaces/editor'
import { Span } from '../interfaces/location'
import { Path } from '../interfaces/path'

export const previous: EditorInterface['previous'] = (editor, options = {}) => {
  const { mode = 'lowest', voids = false } = options
  let { match, at = editor.selection } = options

  if (!at) {
    return
  }

  const pointBeforeLocation = Editor.before(editor, at, { voids })

  if (!pointBeforeLocation) {
    return
  }

  const firstEntry = Editor.first(editor, [])
  if (!firstEntry) {
    return editor.onError({
      key: 'previous.first',
      message: 'Cannot get the first node',
      data: { at },
    })
  }
  const [, to] = firstEntry

  // The search location is from the start of the document to the path of
  // the point before the location passed in
  const span: Span = [pointBeforeLocation.path, to]

  if (Path.isPath(at) && at.length === 0) {
    return editor.onError({
      key: 'previous.root',
      message: `Cannot get the previous node from the root node!`,
    })
  }

  if (match == null) {
    if (Path.isPath(at)) {
      const parentEntry = Editor.parent(editor, at)
      if (!parentEntry) {
        return editor.onError({
          key: 'previous.parent',
          message: 'Cannot get the parent node',
          data: { at },
        })
      }
      const [parent] = parentEntry

      match = n => parent.children.includes(n)
    } else {
      match = () => true
    }
  }

  const [previous] = Editor.nodes(editor, {
    reverse: true,
    at: span,
    match,
    mode,
    voids,
  })

  return previous
}
