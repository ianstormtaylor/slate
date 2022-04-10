import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElement-object', () => {
  const input = {}
  const test = value => {
    return Element.isElement(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
