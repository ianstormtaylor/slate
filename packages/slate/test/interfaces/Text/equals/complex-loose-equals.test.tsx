import { test, expect } from 'vitest'
import { Text } from 'slate'

test('equals-complex-loose-equals', () => {
  const input = {
    textNodeA: {
      text: 'same text',
      bold: true,
      italic: { origin: 'inherited', value: false },
    },
    textNodeB: {
      text: 'diff text',
      bold: true,
      italic: { origin: 'inherited', value: false },
    },
  }

  const test = ({ textNodeA, textNodeB }) => {
    return Text.equals(textNodeA, textNodeB, { loose: true })
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
