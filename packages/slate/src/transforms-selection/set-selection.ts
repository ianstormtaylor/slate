import { SelectionTransforms } from '../interfaces/transforms/selection'
import { Range } from '../interfaces/range'
import { Point } from '../interfaces/point'

export const setSelection: SelectionTransforms['setSelection'] = (
  editor,
  props
) => {
  const { selection } = editor
  const oldProps: Partial<Range> | null = {}
  const newProps: Partial<Range> = {}

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
      (k !== 'anchor' && k !== 'focus' && props[k] !== selection[k])
    ) {
      oldProps[k] = selection[k]
      newProps[k] = props[k]
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
