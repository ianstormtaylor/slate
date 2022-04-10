import { test, expect } from 'vitest'
import { Text } from 'slate'

test('matches-match-false', () => {
  const input = {
    text: { text: '', bold: true },
    props: { italic: true },
  }
  const test = ({ text, props }) => {
    return Text.matches(text, props)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
