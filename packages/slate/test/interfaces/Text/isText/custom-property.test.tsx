import { test, expect } from 'vitest'
import { Text } from 'slate'

test('isText-custom-property', () => {
  const input = {
    text: '',
    custom: true,
  }
  const test = value => {
    return Text.isText(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
