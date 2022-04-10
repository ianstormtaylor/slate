import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElementList-element', () => {
  const input = {
    children: [],
  }
  const test = value => {
    return Element.isElementList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
