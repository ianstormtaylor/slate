import { Text } from 'slate'

export const input = {
  first: { text: 'one', id: 'a' },
  second: { text: 'two', id: 'b' },
}

export const test = ({ first, second }) =>
  Text.equals(first, second, { ignore: ['id'] })

export const output = false
