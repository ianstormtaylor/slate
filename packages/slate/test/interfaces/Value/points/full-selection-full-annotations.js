import { Value } from 'slate'

export const input = {
  nodes: [],
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
  annotations: {
    a: {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 0,
      },
    },
  },
}

export const test = value => {
  return Array.from(Value.points(value))
}

export const output = [
  [input.selection.anchor, 'anchor', input.selection],
  [input.selection.focus, 'focus', input.selection],
  [input.annotations.a.anchor, 'anchor', input.annotations.a, 'a'],
  [input.annotations.a.focus, 'focus', input.annotations.a, 'a'],
]
