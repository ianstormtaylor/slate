import { test, expect } from 'vitest'
import { Element } from 'slate'

test('matches-custom-prop-not-match', () => {
  const input = {
    element: { children: [], type: 'bold' },
    props: { type: 'italic' },
  }
  const test = ({ element, props }) => {
    return Element.matches(element, props)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
