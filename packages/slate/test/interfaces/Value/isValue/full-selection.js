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
  annotations: {},
  custom: true,
}

export const test = value => {
  return Value.isValue(value)
}

export const output = true
