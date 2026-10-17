import { Text } from 'slate'

export const input = {
  first: { text: 'same', id: 'a', metadata: { id: 'a' } },
  second: { text: 'same', id: 'b', metadata: { id: 'b' } },
}

export const test = ({ first, second }) =>
  Text.equals(first, second, { ignore: ['id'] })

export const output = false
