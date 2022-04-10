import { test, expect } from 'vitest'
import { Text } from 'slate'

test('isTextList-boolean', () => {
  const input = true
  const test = value => {
    return Text.isTextList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
