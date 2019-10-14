import { Text } from 'slate'

export const input = [
  {
    nodes: [],
    selection: null,
    annotations: {},
  },
]

export const test = value => {
  return Text.isTextList(value)
}

export const output = false
