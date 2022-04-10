import { test, expect } from 'vitest'
import { Text } from 'slate'

test('equals-exact-equals', () => {
  const input = {
    textNodeA: { text: 'same text', bold: true },
    textNodeB: { text: 'same text', bold: true },
  }

  const test = ({ textNodeA, textNodeB }) => {
    return Text.equals(textNodeA, textNodeB, { loose: false })
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
