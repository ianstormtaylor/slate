import { test, expect } from 'vitest'
import { Text } from 'slate'

test('equals-exact-not-equal', () => {
  const input = {
    textNodeA: { text: 'same text', bold: true },
    textNodeB: { text: 'same text', bold: true, italic: true },
  }

  const test = ({ textNodeA, textNodeB }) => {
    return Text.equals(textNodeA, textNodeB, { loose: false })
  }

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
