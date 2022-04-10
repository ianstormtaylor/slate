import { test, expect } from 'vitest'
import { Element } from 'slate'

test('matches-empty-match', () => {
  const input = {
    element: { children: [] },
    props: {},
  }
  const test = ({ element, props }) => {
    return Element.matches(element, props)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
