import { SelectionTransforms } from '../interfaces/transforms/selection'
import { Point } from '../interfaces/point'
import { Selection } from '../interfaces'
import { NON_SETTABLE_SELECTION_PROPERTIES } from '../interfaces/transforms/general'

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
    if (NON_SETTABLE_SELECTION_PROPERTIES.includes(k)) {
      continue
    }

    const value = Object.hasOwn(selection, k)
      ? selection[<keyof Selection>k]
      : undefined

    const newValue = props[<keyof Selection>k]

    if (compareSelectionProps(<keyof Selection>k, value, newValue)) {
      oldProps[<keyof Selection>k] = selection[<keyof Selection>k]
      newProps[<keyof Selection>k] = props[<keyof Selection>k]
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

function compareSelectionProps(
  key: keyof Selection,
  value: unknown,
  newValue: unknown
) {
  if (
    (key === 'anchor' || key === 'focus') &&
    Point.isPoint(value) &&
    Point.isPoint(newValue)
  ) {
    return !Point.equals(value, newValue)
  }
  return value !== newValue
}
