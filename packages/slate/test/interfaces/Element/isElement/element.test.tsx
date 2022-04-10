import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-element', () => {
  const input = {
    children: [],
  }
  const test = value => {
    return Element.isElement(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
