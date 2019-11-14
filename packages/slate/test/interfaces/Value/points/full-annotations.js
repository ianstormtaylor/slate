import { Value } from 'slate'

export const input = {
  children: [],
  selection: null,
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
  [input.annotations.a.anchor, 'anchor', input.annotations.a, 'a'],
  [input.annotations.a.focus, 'focus', input.annotations.a, 'a'],
]
