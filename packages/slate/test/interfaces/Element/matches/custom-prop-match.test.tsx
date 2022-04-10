import { test, expect } from 'vitest'
import { Element } from 'slate'

test('matches-custom-prop-match', () => {
  const input = {
    element: { children: [], type: 'bold' },
    props: { type: 'bold' },
  }
  const test = ({ element, props }) => {
    return Element.matches(element, props)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
