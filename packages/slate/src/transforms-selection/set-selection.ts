import { Point } from '../interfaces/point'
import type { Range } from '../interfaces/range'
import { NON_SETTABLE_SELECTION_PROPERTIES } from '../interfaces/transforms/general'
import type { SelectionTransforms } from '../interfaces/transforms/selection'

export const setSelection: SelectionTransforms['setSelection'] = (
  editor,
  props
) => {
  const { selection } = editor
  const oldProps: Partial<Range> = {}
  const newProps: Partial<Range> = {}

  if (!selection) {
    return
  }

  for (const k in props) {
    if (NON_SETTABLE_SELECTION_PROPERTIES.includes(k)) {
      continue
    }

    const value = Object.hasOwn(selection, k)
      ? selection[<keyof Range>k]
      : undefined

    const newValue = props[<keyof Range>k]

    if (compareSelectionProps(<keyof Range>k, value, newValue)) {
      oldProps[<keyof Range>k] = selection[<keyof Range>k]
      newProps[<keyof Range>k] = props[<keyof Range>k]
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
  key: keyof Range,
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
