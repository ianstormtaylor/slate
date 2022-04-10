import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-text', () => {
  const input = {
    text: '',
  }
  const test = value => {
    return Element.isElement(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
