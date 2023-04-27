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

  const toEntry = Editor.last(editor, [])
  if (!toEntry) return
  const [, to] = toEntry

  const span: Span = [pointAfterLocation.path, to]

  if (Path.isPath(at) && at.length === 0) {
    editor.onError({
      type: 'next',
      message: `Cannot get the next node from the root node!`,
    })
    return
  }

  if (match == null) {
    if (Path.isPath(at)) {
      const parentEntry = Editor.parent(editor, at)
      if (!parentEntry) return
      const [parent] = parentEntry
      match = n => parent.children.includes(n)
    } else {
      match = () => true
    }
  }

  const [next] = Editor.nodes(editor, { at: span, match, mode, voids })
  return next
}
