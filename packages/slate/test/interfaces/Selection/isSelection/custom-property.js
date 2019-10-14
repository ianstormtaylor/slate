import { Selection } from 'slate'

export const input = {
  isFocused: true,
  marks: null,
  anchor: {
    path: [0, 1],
    offset: 0,
  },
  focus: {
    path: [0, 1],
    offset: 0,
  },
  custom: true,
}

export const test = value => {
  return Selection.isSelection(value)
}

export const output = true
