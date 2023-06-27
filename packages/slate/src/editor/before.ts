import { Editor, EditorInterface } from '../interfaces/editor'

export const before: EditorInterface['before'] = (editor, at, options = {}) => {
  const anchor = Editor.start(editor, [])
  if (!anchor) {
    return editor.onError({
      key: 'before.anchor',
      message: 'Cannot get the anchor point',
      data: { at },
    })
  }

  const focus = Editor.point(editor, at, { edge: 'start' })
  if (!focus) {
    return editor.onError({
      key: 'before.focus',
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
    reverse: true,
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
