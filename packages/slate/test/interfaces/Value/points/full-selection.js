import { Value } from 'slate'

export const input = {
  children: [],
  selection: {
    isFocused: true,
    marks: [],
    anchor: {
      path: [0],
      offset: 0,
    },
    focus: {
      path: [0],
      offset: 0,
    },
  },
}

export const test = value => {
  return Array.from(Value.points(value))
}

export const output = [
  [input.selection.anchor, 'anchor', input.selection],
  [input.selection.focus, 'focus', input.selection],
]
