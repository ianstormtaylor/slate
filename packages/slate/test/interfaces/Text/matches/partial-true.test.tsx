import { test, expect } from 'vitest'
import { Text } from 'slate'

test('matches-partial-true', () => {
  const input = {
    text: { text: '', bold: true, italic: true },
    props: { bold: true },
  }
  const test = ({ text, props }) => {
    return Text.matches(text, props)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
