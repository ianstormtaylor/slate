import { Editor, EditorInterface } from '../interfaces/editor'

export const after: EditorInterface['after'] = (editor, at, options = {}) => {
  const anchor = Editor.point(editor, at, { edge: 'end' })
  const focus = Editor.end(editor, [])
  const range = { anchor, focus }
  const { distance = 1 } = options
  let d = 0
  let target

  for (const p of Editor.positions(editor, {
    ...options,
    at: range,
  })) {
    if (d > distance) {
      break
    }

    if (d !== 0) {
      target = p
    }

    d++
  }

  return target
}
