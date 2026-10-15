import { Text } from 'slate'

export const input = {
  first: { text: 'one', id: 'a', bold: true },
  second: { text: 'two', bold: true },
}

export const test = ({ first, second }) =>
  Text.equals(first, second, { loose: true, ignore: ['id'] })

export const output = true
