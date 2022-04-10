import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElementList-not-full-element', () => {
  const input = [
    {
      children: [],
    },
    {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
    },
  ]
  const test = value => {
    return Element.isElementList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
