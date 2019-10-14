import { Selection } from 'slate'

export const input = {
  isFocused: true,
  marks: null,
  focus: {
    path: [0, 1],
    offset: 0,
  },
}

export const test = value => {
  return Selection.isSelection(value)
}

export const output = false
