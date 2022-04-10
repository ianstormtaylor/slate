import { test, expect } from 'vitest'
import { Text } from 'slate'

test('isTextList-empty', () => {
  const input = []
  const test = value => {
    return Text.isTextList(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
