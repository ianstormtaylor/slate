import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElementList-full-element', () => {
  const input = [
    {
      children: [],
    },
  ]
  const test = value => {
    return Element.isElementList(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
