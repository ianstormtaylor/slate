import { SelectionTransforms } from '../interfaces/transforms/selection'
import { Point } from '../interfaces/point'
import { Selection } from '../interfaces'

export const setSelection: SelectionTransforms['setSelection'] = (
  editor,
  props
) => {
  const { selection } = editor
  const oldProps: Partial<Selection> = {}
  const newProps: Partial<Selection> = {}

  if (!selection) {
    return
  }

  for (const k in props) {
    if (
      (k === 'anchor' &&
        props.anchor != null &&
        !Point.equals(props.anchor, selection.anchor)) ||
      (k === 'focus' &&
        props.focus != null &&
        !Point.equals(props.focus, selection.focus)) ||
      (k !== 'anchor' &&
        k !== 'focus' &&
        props[k as keyof Selection] !== selection[k as keyof Selection])
    ) {
      oldProps[k as keyof Selection] = selection[k as keyof Selection]
      newProps[k as keyof Selection] = props[k as keyof Selection]
    }
  }

  if (Object.keys(oldProps).length > 0) {
    editor.apply({
      type: 'set_selection',
      properties: oldProps,
      newProperties: newProps,
    })
  }
}
