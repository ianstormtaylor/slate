import { test, expect } from 'vitest'
import { Element } from 'slate'
import { isHeadingElement } from './type-guards'

test('headingElement-true', () => {
  const input: Element = {
    type: 'heading',
    level: 5,
    children: [],
  }

  const test = isHeadingElement

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
