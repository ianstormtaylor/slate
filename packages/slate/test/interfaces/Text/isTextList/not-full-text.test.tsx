import { test, expect } from 'vitest'
import { Text } from 'slate'

test('isTextList-not-full-text', () => {
  const input = [
    {
      text: '',
    },
    {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
    },
  ]
  const test = value => {
    return Text.isTextList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
