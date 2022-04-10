import { test, expect } from 'vitest'
import { Text } from 'slate'

test('isText-text-full', () => {
  const input = {
    text: 'string',
  }
  const test = value => {
    return Text.isText(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
