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

  const [, to] = Editor.first(editor, [])

  // The search location is from the start of the document to the path of
  // the point before the location passed in
  const span: Span = [pointBeforeLocation.path, to]

  if (Path.isPath(at) && at.length === 0) {
    throw new Error(`Cannot get the previous node from the root node!`)
  }

  if (match == null) {
    if (Path.isPath(at)) {
      const [parent] = Editor.parent(editor, at)
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
