import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-isElementType', () => {
  const input = {
    type: 'paragraph',
    children: [{ text: '' }],
  }
  const test = value => Element.isElementType(value, 'paragraph')

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
