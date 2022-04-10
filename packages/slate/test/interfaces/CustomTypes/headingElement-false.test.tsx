import { test, expect } from 'vitest'
import { Element } from 'slate'
import { isHeadingElement } from './type-guards'

test('headingElement-false', () => {
  const input: Element = {
    type: 'list-item',
    depth: 5,
    children: [],
  }

  const test = isHeadingElement

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
