import { test, expect } from 'vitest'
import { Element } from 'slate'

test('isElementList-boolean', () => {
  const input = true
  const test = value => {
    return Element.isElementList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
