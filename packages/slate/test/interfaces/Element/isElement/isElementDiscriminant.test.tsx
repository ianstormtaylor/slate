import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-isElementDiscriminant', () => {
  const input = {
    source: 'heading-large',
    children: [{ text: '' }],
  }
  const test = value => Element.isElementType(value, 'heading-large', 'source')

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
