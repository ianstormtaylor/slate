import { Text } from 'slate'

export const input = {
  first: { text: 'same', id: 'a', bold: true },
  second: { text: 'same', id: 'b', bold: true },
}

export const test = ({ first, second }) =>
  Text.equals(first, second, { ignore: ['id'] })

export const output = true
