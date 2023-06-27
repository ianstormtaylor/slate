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
  if (!toEntry) {
    return editor.onError({
      key: 'next.last',
      message: 'Cannot get the last node',
      data: { at },
    })
  }

  const [, to] = toEntry

  const span: Span = [pointAfterLocation.path, to]

  if (Path.isPath(at) && at.length === 0) {
    return editor.onError({
      key: 'next.root',
      message: 'Cannot get the next node',
      data: { at },
    })
  }

  if (match == null) {
    if (Path.isPath(at)) {
      const parentEntry = Editor.parent(editor, at)
      if (!parentEntry) {
        return editor.onError({
          key: 'next.parent',
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

  const [next] = Editor.nodes(editor, { at: span, match, mode, voids })
  return next
}
