import { Text } from 'slate'

export const input = [
  {
    nodes: [],
  },
]

export const test = value => {
  return Text.isTextList(value)
}

export const output = false
