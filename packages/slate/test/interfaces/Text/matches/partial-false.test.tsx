import { test, expect } from 'vitest'
import { Text } from 'slate'

test('matches-partial-false', () => {
  const input = {
    text: { text: '', bold: true, italic: true },
    props: { underline: true },
  }
  const test = ({ text, props }) => {
    return Text.matches(text, props)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
