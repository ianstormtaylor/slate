import { Text } from 'slate'

export const input = [
  {
    text: '',
    marks: [],
  },
]

export const test = value => {
  return Text.isTextList(value)
}

export const output = true
