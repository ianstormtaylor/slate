import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-isElementTypeFalse', () => {
  const input = {
    type: 'heading-large',
    children: [{ text: '' }],
  }
  const test = value => Element.isElementType(value, 'paragraph')

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
