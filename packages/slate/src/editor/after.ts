import { Editor, EditorInterface } from '../interfaces/editor'

export const after: EditorInterface['after'] = (editor, at, options = {}) => {
  const anchor = Editor.point(editor, at, { edge: 'end' })
  if (!anchor) {
    return editor.onError({
      key: 'after.anchor',
      message: 'Cannot get the anchor point',
      data: { at },
    })
  }

  const focus = Editor.end(editor, [])
  if (!focus) {
    return editor.onError({
      key: 'after.focus',
      message: 'Cannot get the focus point',
      data: { at },
    })
  }

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
