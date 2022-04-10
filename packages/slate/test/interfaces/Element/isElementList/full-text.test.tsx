import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElementList-full-text', () => {
  const input = [
    {
      text: '',
    },
  ]
  const test = value => {
    return Element.isElementList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
