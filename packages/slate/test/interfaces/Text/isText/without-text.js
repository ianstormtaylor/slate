import { Text } from 'slate'

export const input = {
  marks: [],
}

export const test = value => {
  return Text.isText(value)
}

export const output = false
