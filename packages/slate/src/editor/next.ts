import { Editor, EditorInterface } from '../interfaces/editor'
import { Span } from '../interfaces/location'
import { Path } from '../interfaces/path'

export const next: EditorInterface['next'] = (editor, options = {}) => {
  const { mode = 'lowest', voids = false } = options
  let { match, at = editor.selection } = options

  if (!at) {
    return
  }

  const pointAfterLocation = Editor.after(editor, at, { voids })

  if (!pointAfterLocation) return

  const [, to] = Editor.last(editor, [])

  const span: Span = [pointAfterLocation.path, to]

  if (Path.isPath(at) && at.length === 0) {
    throw new Error(`Cannot get the next node from the root node!`)
  }

  if (match == null) {
    if (Path.isPath(at)) {
      const [parent] = Editor.parent(editor, at)
      match = n => parent.children.includes(n)
    } else {
      match = () => true
    }
  }

  const [next] = Editor.nodes(editor, { at: span, match, mode, voids })
  return next
}
