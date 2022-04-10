import { test, expect } from 'vitest'
import { Text } from 'slate'

test('equals-loose-equals', () => {
  const input = {
    textNodeA: { text: 'some text', bold: true },
    textNodeB: { text: 'diff text', bold: true },
  }

  const test = ({ textNodeA, textNodeB }) => {
    return Text.equals(textNodeA, textNodeB, { loose: true })
  }

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
