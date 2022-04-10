import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-custom-property', () => {
  const input = {
    children: [],
    custom: 'value',
  }
  const test = value => {
    return Element.isElement(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
