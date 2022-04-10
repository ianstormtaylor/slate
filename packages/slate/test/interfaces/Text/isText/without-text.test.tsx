import { test, expect } from 'vitest'
import { Text } from 'slate'

test('isText-without-text', () => {
  const input = {}
  const test = value => {
    return Text.isText(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
